import * as zarr from "@zarrita/core";
import {
  Chunk,
  DataType,
  Location,
  Listable,
  TypedArray,
  CodecMetadata,
} from "@zarrita/core";
import { Mutable, AsyncReadable } from "@zarrita/storage";
import { get, set, Slice, slice } from "@zarrita/indexing";
import { BoolArray } from "zarrita";
import { Table, DataType as ArrowDataType } from "apache-arrow";
import { Geometry, Feature, FeatureCollection } from "geojson";
import { Geometry as WkxGeometry } from "wkx-ts";
import { Buffer } from "buffer/index";

import { CachedHTTPStore, zarr_open_v2_datetime } from "./zarr";
import { Schema, Coordkeys } from "./datasource";
import { measureTime } from "./observe";

export type ATypedArray =
  | Int8Array
  | Int16Array
  | Int32Array
  | BigInt64Array
  | Uint8Array
  | Uint16Array
  | Uint32Array
  | BigUint64Array
  | Float32Array
  | Float64Array;
export type Scalar = string | number | boolean;
export type NDArray =
  | Scalar[]
  | Scalar[][]
  | Scalar[][][]
  | Scalar[][][][]
  | ATypedArray[]
  | ATypedArray[][]
  | ATypedArray[][][]
  | ATypedArray[][][][];
export type Data = NDArray | ATypedArray | Scalar;

/**
 * Represents a data variable.
 */
export type DataVariable = {
  /**
   * Attributes of the variable.
   */
  attributes: Record<string, string | unknown>;
  /**
   * Dimensions of the variable
   *  */
  dimensions: string[];
  /**
   * Datatype of the variable.
   */
  dtype?: DataType;
  /**
   * Data associated with the variable.
   */
  data?: Data;
};

export const wkb_to_geojson = (wkb: string) => {
  const b = new Buffer(wkb, "base64");
  const geometry = WkxGeometry.parse(b);
  return geometry.toGeoJSON();
};

const isArray = (data?: Data) => {
  return data && (Array.isArray(data) || ArrayBuffer.isView(data));
};

const getShape = (a: Data) => {
  const dim = [] as number[];
  if (!isArray(a)) return dim;
  for (;;) {
    // @ts-expect-error: Scalar already returned
    dim.push(a.length);
    // @ts-expect-error: Scalar already returned
    if (isArray(a[0])) {
      // @ts-expect-error: Scalar already returned
      a = a[0];
    } else {
      break;
    }
  }
  return dim;
};

const getDtype = (data: Data): DataType => {
  for (;;) {
    if (Array.isArray(data)) {
      data = data[0];
    } else {
      break;
    }
  }
  if (data === null || data === undefined) {
    return "uint8";
  } else {
    switch (data.constructor.name) {
      case "Boolean":
        return "bool";
      case "Number":
        return "float32";
      case "Int8Array":
        return "int8";
      case "Int16Array":
        return "int16";
      case "Int32Array":
        return "int32";
      case "BigInt64Array":
        return "int64";
      case "Uint8Array":
        return "uint8";
      case "Uint16Array":
        return "uint16";
      case "Uint32Array":
        return "uint32";
      case "Float32Array":
        return "float32";
      case "Float64Array":
        return "float64";
      case "String":
        return "v2:object";
      case "Object":
        return "v2:object";
    }
  }

  throw new Error("Unsupported data type: " + data.constructor.name);
};

const arrowTypeToDType = (dtype: ArrowDataType): DataType => {
  //Convert arrow data type to zarr datatype
  let type: string = dtype.toString().toLowerCase();
  if (dtype.typeId == 5) {
    type = "v2:object";
  } else if (dtype.typeId == 1) {
    type = "uint8";
  }
  return type as DataType;
};

const ravel = (data: Data) => {
  if (!Array.isArray(data)) return data;
  const flat = (data as NDArray).flat(Infinity);
  if (isArray(flat[0])) {
    // @ts-expect-error: Is array
    const len = flat[0].length;
    // @ts-expect-error: Is array
    const arr = new flat[0].constructor(flat.length * len);
    for (let i = 0; i < flat.length; i++) {
      arr.set(flat[i], i * len);
    }
    return arr;
  } else {
    return flat;
  }
};

const get_strides = (shape: readonly number[]) => {
  const ndim = shape.length;
  const stride: number[] = Array(ndim);
  for (let i = ndim - 1, step = 1; i >= 0; i--) {
    stride[i] = step;
    step *= shape[i];
  }
  return stride;
};

const unravel = <T extends DataType>(
  data: TypedArray<T>,
  shape: number[],
  stride: number[],
  offset = 0
): Data => {
  // @ts-expect-error: Is array
  if (shape.length === 0) return data[0];
  if (shape.length === 1) {
    // @ts-expect-error: Is array
    const arr = new data.constructor(shape[0]);
    // @ts-expect-error: Is array
    arr.set(data.slice(offset, offset + shape[0]));
    return arr;
  }

  const arr = new Array(shape[0]);
  for (let i = 0; i < shape[0]; i++) {
    arr[i] = unravel(
      data,
      shape.slice(1),
      stride.slice(1),
      offset + i * stride[0]
    );
  }
  return arr;
};

const npdatetime_to_posixtime = (data: Chunk<DataType>, dtype: string) => {
  const [_, unit] = dtype.split("<M8");
  const _data = new Float64Array(data.data.length);
  let _divisor = 1n;
  switch (unit) {
    case "[ms]":
      _divisor = 1000n;
      break;
    case "[us]":
      _divisor = 1000000n;
      break;
    case "[ns]":
      _divisor = 1000000000n;
      break;
    default:
      _divisor = 1n;
      break;
  }
  for (let i = 0; i < data.data.length; i++) {
    _data[i] = Number(data.data[i] / _divisor);
  }
  return unravel(_data, data.shape, data.stride);
};

const flatten = (
  data: Record<string, DataVariable>,
  dims: Record<string, number>,
  rows: Record<string, unknown>[]
): Record<string, unknown>[] => {
  const dim = Object.keys(dims);
  const arrays = {} as Record<string, boolean>;
  for (const k in data) {
    if (isArray(data[k].data)) {
      arrays[k] = true;
    }
  }
  if (dim.length == 1) {
    for (let i = 0; i < dims[dim[0]]; i++) {
      const row = {} as Record<string, unknown>;
      for (const k in data) {
        if (arrays[k]) {
          // @ts-expect-error: Is array
          if (data[k].data.length > 1) row[k] = data[k].data[i];
        } else {
          row[k] = data[k].data;
        }
      }
      rows.push(row);
    }
  } else {
    for (let i = 0; i < dims[dim[0]]; i++) {
      const subdata = {} as Record<string, DataVariable>;
      for (const k in data) {
        if (data[k].dimensions.includes(dim[0])) {
          subdata[k] = {
            attributes: data[k].attributes,
            // @ts-expect-error: Is array because include dims
            data: data[k].data[i],
            dimensions: data[k].dimensions.slice(1),
          };
        } else {
          subdata[k] = data[k];
        }
      }
      const subdims = { ...dims };
      delete subdims[dim[0]];
      flatten(subdata, subdims, rows);
    }
  }
  return rows;
};

/** @ignore */
export type HttpZarr = Location<Listable<CachedHTTPStore>>;
/** @ignore */
export type TempZarr = Location<Mutable>;
type SliceDef = (null | Slice | number)[] | null | undefined;
/**
 * Represents a data variable within a dataset.
 */
export class DataVar<
  /** @ignore */
  DType extends DataType,
  S extends TempZarr | HttpZarr,
> {
  /**
   * Creates an instance of DataVar.
   * @param id - The identifier for the data variable.
   * @param dimensions - The dimensions associated with the data variable.
   * @param attributes - The attributes of the data variable, represented as a record of key-value pairs.
   * @param arr - The zarr array associated with the data variable.
   */
  id: string;
  dimensions: string[];
  attributes: Record<string, unknown>;
  arr: S extends TempZarr
    ? zarr.Array<DType, Mutable>
    : zarr.Array<DType, AsyncReadable>;
  constructor(
    id: string,
    dimensions: string[],
    attributes: Record<string, unknown>,
    arr: S extends TempZarr
      ? zarr.Array<DType, Mutable>
      : zarr.Array<DType, AsyncReadable>
  ) {
    this.id = id;
    this.dimensions = dimensions;
    this.attributes = attributes;
    this.arr = arr; // zarr array
  }

  /**
   * Retrieves the data from the zarr array. If the data is already cached, it returns the cached data.
   * @param index - Optional slice parameters to retrieve specific data from the zarr array.
   * @returns A promise that resolves to the data of the zarr array.
   */

  @measureTime
  async get(index?: SliceDef | string[]): Promise<Data> {
    if (this.arr.shape.length == 0 || this.arr.shape[0] == 0) {
      return [];
    }
    const _index =
      index &&
      index.map((i) => {
        if (typeof i === "string") {
          const [start, stop, step] = i.split(":");
          return slice(
            parseInt(start),
            parseInt(stop),
            parseInt(step)
          ) as Slice;
        } else {
          return i;
        }
      });
    const _data: Chunk<DType> | Scalar = await get(
      this.arr as zarr.Array<DType, AsyncReadable>,
      _index as SliceDef
    );
    if (this.arr.dtype == "v2:object" || !_data.shape) {
      return _data.data as Data;
    } else if (this.arr.dtype == "bool") {
      return [..._data.data] as Data;
    } else if (this.arr.attrs._dtype?.startsWith("<M8")) {
      return npdatetime_to_posixtime(_data, this.arr.attrs._dtype) as Data;
    } else {
      return unravel(_data.data, _data.shape, _data.stride);
    }
  }
}

/**
 * Represents a dataset with dimensions, data variables, and attributes.
 * Implements the DatasetApi interface.
 */
export interface ZarrOptions {
  parameters?: Record<string, string | number>;
  chunks?: string;
  downsample?: Record<string, number>;
  coordkeys?: Coordkeys;
  timeout?: number;
  nocache?: boolean;
}

export class Dataset<S extends HttpZarr | TempZarr> {
  /**
   * Creates an instance of Dataset.
   * @param dimensions - The dimensions of the dataset.
   * @param variables - The data variables of the dataset.
   * @param attributes - The attributes of the dataset.
   * @param root - The root group of the dataset.
   * @param coordkeys - The coordinates map of the dataset.
   */
  dimensions: Record<string, number>;
  variables: S extends TempZarr
    ? Record<string, DataVar<DataType, TempZarr>>
    : Record<string, DataVar<DataType, HttpZarr>>;
  attributes: Record<string, unknown>;
  coordkeys: Coordkeys;
  root: S;

  constructor(
    dimensions: Record<string, number>,
    variables: S extends TempZarr
      ? Record<string, DataVar<DataType, TempZarr>>
      : Record<string, DataVar<DataType, HttpZarr>>,
    attributes: Record<string, unknown>,
    coordkeys: Coordkeys,
    root: S
  ) {
    this.dimensions = dimensions;
    this.variables = variables;
    this.attributes = attributes;
    this.coordkeys = coordkeys;
    this.root = root;
  }

  /**
   * Creates a Dataset instance from a Zarr store.
   * @param url - The URL of the datamesh gateway.
   * @param authHeaders - The authentication headers.
   * @param options.chunks - Optional chunking for the request.
   * @param options.downsample - Optional downsample parameters for the request.
   * @param options.parameters - Optional parameters for the request.
   * @param options.coordkeys - Optional coordinates for the request.
   * @param options.timeout - Optional timeout for the request.
   * @param options.nocache - Disable caching
   * @returns A promise that resolves to a Dataset instance.
   */
  //@measureTime
  static async zarr(
    url: string,
    authHeaders: Record<string, string>,
    options: ZarrOptions = {}
  ): Promise<Dataset<HttpZarr>> {
    const store = new CachedHTTPStore(url, authHeaders, {
      chunks: options.chunks,
      downsample: options.downsample,
      parameters: options.parameters,
      timeout: options.timeout,
      nocache: options.nocache,
    }) as AsyncReadable;
    const _zarr = await zarr.withConsolidated(store);
    const root = await zarr.open(_zarr, { kind: "group" });
    const vars = {} as Record<string, DataVar<DataType, HttpZarr>>;
    const dims = {} as Record<string, number>;
    for (const item of _zarr.contents()) {
      if (item.kind == "array") {
        let arr;
        try {
          arr = await zarr.open(root.resolve(item.path), {
            kind: "array",
          });
        } catch (e) {
          if (e.message.includes("<M8")) {
            //A python <M8 type fails to load
            arr = await zarr_open_v2_datetime(root.resolve(item.path), {
              kind: "array",
            });
          } else {
            throw e;
          }
        }
        const array_dims = arr.attrs._ARRAY_DIMENSIONS as string[] | null;
        const vid = item.path.split("/").pop() as string;
        vars[vid] = new DataVar<DataType, HttpZarr>(
          vid,
          array_dims || [],
          arr.attrs as Record<string, unknown>,
          arr
        );
        if (array_dims)
          array_dims.map((dim: string, i: number) => {
            const n = (arr.shape as number[])[i];
            if (dims[dim] && dims[dim] != n) {
              throw new Error(
                `Inconsistent dimension size for ${dim}: ${dims[dim]} != ${n}`
              );
            } else {
              dims[dim] = n;
            }
          });
      }
    }
    const coords = (JSON.parse(root.attrs["_coordinates"] as string) ||
      {}) as Coordkeys;
    return new Dataset<HttpZarr>(
      dims,
      vars,
      root.attrs,
      options.coordkeys || coords,
      root
    );
  }

  static async fromArrow(
    data: Table,
    coordkeys: Coordkeys
  ): Promise<Dataset<TempZarr>> {
    const attributes = {};
    const dimensions = { record: data.numRows };
    const variables = {} as Record<string, DataVariable>;
    data.schema.fields.forEach((field) => {
      const column = data.getChild(field.name);
      let attrs = {};
      let array = column?.toArray();
      let dtype = arrowTypeToDType(field.type);
      //Store times internally as Unix seconds in Float64 - this is consistent with Datamesh zarr
      if (ArrowDataType.isTimestamp(field.type)) {
        const carray = new Float64Array(array.length);
        const m = BigInt(1000 ** (field.type.unit - 0));
        for (let i = 0; i < array.length; i++) {
          carray[i] = Number(array[i] / m);
        }
        array = carray;
        dtype = "float64";
        attrs = { unit: `Unix timestamp (s)` };
      } else if (ArrowDataType.isBinary(field.type)) {
        const carray = [];
        for (let i = 0; i < array.length; i++) {
          carray.push(new Buffer(array[i]).toString("base64"));
        }
        array = carray;
        dtype = "v2:object";
      }
      variables[field.name] = {
        dimensions: ["record"],
        attributes: attrs,
        data: array,
        dtype,
      };
    });
    return await Dataset.init({ dimensions, variables, attributes }, coordkeys);
  }

  static async fromGeojson(
    geojson: FeatureCollection | Feature,
    coordkeys?: Coordkeys
  ): Promise<Dataset<TempZarr>> {
    if (
      !("features" in geojson && Array.isArray(geojson.features)) &&
      !("geometry" in geojson)
    ) {
      throw new Error("Invalid GeoJSON");
    }
    const features: Feature[] =
      "features" in geojson && geojson.features
        ? geojson.features
        : [geojson as Feature];
    if (features.length === 0) {
      throw new Error("FeatureCollection contains no features");
    }

    // Extract all unique property keys from features
    const propertyKeys = new Set<string>();
    features.forEach((feature) => {
      if (feature.properties) {
        Object.keys(feature.properties).forEach((key) => propertyKeys.add(key));
      }
    });

    // Create a flattened array of records
    const records: Array<Record<string, unknown>> = features.map(
      (feature: Feature) => {
        const record: Record<string, unknown> = {
          geometry: feature.geometry,
        };
        if (feature.properties) {
          Object.assign(record, feature.properties);
        }
        return record;
      }
    );

    // Create schema with dimensions and variables
    const schema: Schema = {
      dimensions: { index: records.length },
      variables: {},
      attributes: {},
    };

    // Create temporary dataset
    const dataset = await Dataset.init(schema, { ...coordkeys, g: "geometry" });

    // Add geometry variable
    await dataset.assign(
      "geometry",
      ["index"],
      records.map((r) => r.geometry) as Data,
      { description: "GeoJSON geometry" }
    );

    // Add property variables
    for (const key of propertyKeys) {
      const values = records.map((r) => r[key]) as Data;
      await dataset.assign(key, ["index"], values, {
        description: `Property: ${key}`,
      });
    }

    return dataset;
  }

  /**
   * Initializes an in memory Dataset instance from a data object.
   * @param datasource - An object containing id, dimensions, data variables, and attributes.
   */
  static async init(
    datasource: Schema,
    coordkeys?: Coordkeys
  ): Promise<Dataset<TempZarr>> {
    const root = (await zarr.create(new Map(), {
      attributes: { created: new Date() },
    })) as TempZarr;
    const ds = new Dataset(
      datasource.dimensions,
      {},
      datasource.attributes || {},
      coordkeys || {},
      root
    );
    for (const k in datasource.variables) {
      const { dimensions, attributes, data, dtype }: DataVariable =
        datasource.variables[k];
      await ds.assign(
        k,
        dimensions,
        data as Data,
        attributes,
        dtype && (dtype as string) === "string" ? "v2:object" : dtype
      );
    }
    return ds;
  }

  /**
   * Converts the dataset into a dataframe format.
   *
   * @returns {Promise<Record<string, unknown>[]>} A promise that resolves to an array of records,
   * where each record represents a row in the dataframe.
   *
   * @remarks
   * This method iterates over the data variables, retrieves their dimensions and data,
   * and then flattens the data into a dataframe structure.
   * Time coordinates are converted to IDO8601 format.
   * BigInt datatypes are coerced to number.
   *
   * @example
   * ```typescript
   * const dataframe = await instance.asDataframe();
   * console.log(dataframe);
   * ```
   */
  //@measureTime
  async asDataframe(): Promise<Record<string, unknown>[]> {
    const data = {} as Record<string, DataVariable>;
    const bigint = [];
    for (const k in this.variables) {
      data[k] = {
        attributes: this.variables[k].attributes,
        dimensions: this.variables[k].dimensions,
      };
      data[k].data = (await this.variables[k].get()) as Data;
      if (this.variables[k].arr.dtype == "int64") {
        bigint.push(k);
      }
    }
    const df = flatten(data, { ...this.dimensions }, []);
    if (this.coordkeys.t) {
      for (let i = 0; i < df.length; i++) {
        df[i][this.coordkeys.t] = new Date(
          1000 * (df[i][this.coordkeys.t] as number)
        ).toISOString();
      }
    }
    //Convert BigInt to number
    if (bigint.length > 0) {
      for (const k of bigint) {
        for (let i = 0; i < df.length; i++) {
          df[i][k] = Number(df[i][k]);
        }
      }
    }
    return df;
  }

  /**
   * Converts the dataset into a GeoJSON Feature.
   * @param geometry - Optional GeoJSON geometry to apply to all records, otherwise geometry column is required. Will override geometry column if present.
   *
   * @returns {Promise<FeatureCollection>} A promise that resolves to an array of records,
   * where each record represents a row in the dataframe.
   *
   * @throws Will throw an error if no geometry is found in data or as a parameter
   *
   * @remarks
   * This method iterates over the data variables, retrieves their dimensions and data,
   * and then flattens the data into a dataframe structure.
   *
   * @example
   * ```typescript
   * const dataframe = await instance.asDataframe();
   * console.log(dataframe);
   * ```
   */
  async asGeojson(geometry?: Geometry): Promise<FeatureCollection> {
    if (!this.coordkeys.g && !geometry) {
      throw new Error("No geometry found");
    }
    const features = [] as Feature[];
    const df = await this.asDataframe();
    for (let i = 0; i < df.length; i++) {
      const { ...properties } = df[i];
      let geom = geometry;
      if (!geom && this.coordkeys.g) {
        delete properties[this.coordkeys.g];
        const g = df[i][this.coordkeys.g] as string;
        if (g.slice(0, 7) == '{"type:') {
          //GeoJSON
          geom = JSON.parse(g) as Geometry;
        } else {
          //WKB
          geom = wkb_to_geojson(g);
        }
      }
      features.push({
        type: "Feature",
        geometry: geom as Geometry,
        properties,
      });
    }
    return {
      type: "FeatureCollection",
      features,
    };
  }

  /**
   * Asynchronously assigns data to a variable in the dataset.
   *
   * @param varid - The identifier for the variable.
   * @param dims - An array of dimension names corresponding to the data.
   * @param data - The data to be assigned, which can be a multi-dimensional array.
   * @param attrs - Optional. A record of attributes to be associated with the variable.
   * @param dtype - Optional. The data type of the data.
   * @param chunks - Optional. An array specifying the chunk sizes for the data.
   *
   * @returns A promise that resolves when the data has been successfully assigned.
   * @throws Will throw an error if the shape of the data does not match the provided dimensions.
   * @throws Will throw an error if an existing dimension size does not match the new data.
   */
  async assign(
    varid: string,
    dims: string[],
    data: Data,
    attrs?: Record<string, unknown>,
    dtype?: DataType,
    chunks?: number[]
  ): Promise<void> {
    const shape = getShape(data);
    if (shape.length != dims.length) {
      throw new Error("Data shape does not match dimensions");
    }
    dims.map((dim, i) => {
      if (this.dimensions[dim]) {
        if (this.dimensions[dim] != shape[i]) {
          throw new Error(
            `Existing size of dimension ${dim} does not match new data`
          );
        }
      } else {
        this.dimensions[dim] = shape[i];
      }
    });
    const _dtype = dtype || getDtype(data);
    const arr = await zarr.create(
      this.root.resolve(varid) as Location<Mutable>,
      {
        shape,
        data_type: _dtype,
        chunk_shape: chunks || shape,
        codecs:
          _dtype == "v2:object" ? [{ name: "json2" } as CodecMetadata] : [],
      }
    );
    let _data = ravel(data);
    if (_data.length == 0) {
      _data = null;
    } else if (_dtype == "bool") {
      _data = new BoolArray(_data);
    } else if (Array.isArray(_data) && _dtype == "float32") {
      _data = Float32Array.from(_data, (n) => (n == null ? NaN : n));
    } else if (Array.isArray(_data) && _dtype == "float64") {
      _data = Float64Array.from(_data, (n) => (n == null ? NaN : n));
    } else if (Array.isArray(_data) && _dtype == "int8") {
      _data = Int8Array.from(_data);
    } else if (Array.isArray(_data) && _dtype == "int16") {
      _data = Int16Array.from(_data);
    } else if (Array.isArray(_data) && _dtype == "int32") {
      _data = Int32Array.from(_data);
    } else if (Array.isArray(_data) && _dtype == "int64") {
      _data = BigInt64Array.from(_data.map((d) => BigInt(d)));
    } else if (Array.isArray(_data) && _dtype == "uint8") {
      _data = Uint8Array.from(_data);
    } else if (Array.isArray(_data) && _dtype == "uint16") {
      _data = Uint16Array.from(_data);
    } else if (Array.isArray(_data) && _dtype == "uint32") {
      _data = Uint32Array.from(_data);
    } else if (Array.isArray(_data) && _dtype == "uint64") {
      _data = BigUint64Array.from(_data.map((d) => BigInt(d)));
    }
    if (_data) {
      await set(
        arr,
        shape.map(() => null),
        {
          data: _data,
          shape: shape,
          stride: get_strides(shape),
        }
      );
    }
    this.variables[varid] = new DataVar(varid, dims, attrs || {}, arr);
  }
}
