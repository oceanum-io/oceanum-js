import * as zarr from "@zarrita/core";
import { Chunk, DataType, Listable, Location, TypedArray } from "@zarrita/core";
import { Mutable, AsyncReadable } from "@zarrita/storage";
import { get, set, Slice } from "@zarrita/indexing";
import { Table, DataType as ArrowDataType } from "apache-arrow";
import { Feature, Geometry, FeatureCollection } from "geojson";
import wkx from "wkx";

import { CachedHTTPStore } from "./zarr";
import { Schema, Coordinates } from "./datasource";
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
  attrs: Record<string, string | unknown>;
  /**
   * Dimensions of the variable
   *  */
  dims: string[];
  /**
   * Datatype of the variable.
   */
  dtype?: string;
  /**
   * Data associated with the variable.
   */
  data?: Data;
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
  if (typeof data === "number") {
    return "float32";
  } else if (typeof data === "string") {
    return "v2:object";
  } else {
    switch (data.constructor.name) {
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
    }
  }

  throw new Error("Unsupported data type: " + data.constructor.name);
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

function get_strides(shape: readonly number[]) {
  const ndim = shape.length;
  const stride: number[] = Array(ndim);
  for (let i = ndim - 1, step = 1; i >= 0; i--) {
    stride[i] = step;
    step *= shape[i];
  }
  return stride;
}

function unravel<T extends DataType>(
  data: TypedArray<T>,
  shape: number[],
  stride: number[],
  offset = 0
): Data {
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
}

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
        if (data[k].dims.includes(dim[0])) {
          subdata[k] = {
            attrs: {},
            // @ts-expect-error: Is array because include dims
            data: data[k].data[i],
            dims: data[k].dims.slice(1),
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
export type DatameshStore = Location<Listable<AsyncReadable>>;
/** @ignore */
export type TempStore = Location<Mutable>;

/**
 * Represents a data variable within a dataset.
 */
export class DataVar<
  /** @ignore */
  DType extends DataType,
  S extends TempStore | DatameshStore,
> {
  /**
   * Creates an instance of DataVar.
   * @param id - The identifier for the data variable.
   * @param dims - The dimensions associated with the data variable.
   * @param attrs - The attributes of the data variable, represented as a record of key-value pairs.
   * @param arr - The zarr array associated with the data variable.
   */
  id: string;
  dims: string[];
  attrs: Record<string, unknown>;
  arr: S extends TempStore
    ? zarr.Array<DType, Mutable>
    : zarr.Array<DType, AsyncReadable>;
  constructor(
    id: string,
    dims: string[],
    attrs: Record<string, unknown>,
    arr: S extends TempStore
      ? zarr.Array<DType, Mutable>
      : zarr.Array<DType, AsyncReadable>
  ) {
    this.id = id;
    this.dims = dims;
    this.attrs = attrs;
    this.arr = arr; // zarr array
  }

  /**
   * Retrieves the data from the zarr array. If the data is already cached, it returns the cached data.
   * @param slice - Optional slice parameters to retrieve specific data from the zarr array.
   * @returns A promise that resolves to the data of the zarr array.
   */
  @measureTime
  async get(
    slice?: (null | Slice | number)[] | null | undefined
  ): Promise<Data> {
    const _data: Chunk<DType> | Scalar = await get(
      this.arr as zarr.Array<DType, AsyncReadable>,
      slice
    );
    if (this.arr.dtype !== "v2:object" && _data.shape) {
      return unravel(_data.data, _data.shape, _data.stride);
    } else {
      return _data.data as Data;
    }
  }
}

/**
 * Represents a dataset with dimensions, data variables, and attributes.
 * Implements the DatasetApi interface.
 */
export class Dataset</** @ignore */ S extends DatameshStore | TempStore> {
  /**
   * Creates an instance of Dataset.
   * @param dims - The dimensions of the dataset.
   * @param data_vars - The data variables of the dataset.
   * @param attrs - The attributes of the dataset.
   * @param root - The root group of the dataset.
   * @param coordinates - The coordinates map of the dataset.
   */
  dims: Record<string, number>;
  data_vars: S extends TempStore
    ? Record<string, DataVar<DataType, TempStore>>
    : Record<string, DataVar<DataType, DatameshStore>>;
  attrs: Record<string, unknown>;
  coordinates: Coordinates;
  root: S;

  constructor(
    dims: Record<string, number>,
    data_vars: S extends TempStore
      ? Record<string, DataVar<DataType, TempStore>>
      : Record<string, DataVar<DataType, DatameshStore>>,
    attrs: Record<string, unknown>,
    coordinates: Coordinates,
    root: S
  ) {
    this.data_vars = data_vars;
    this.dims = dims;
    this.attrs = attrs;
    this.root = root;
    this.coordinates = coordinates;
  }

  /**
   * Creates a Dataset instance from a Zarr store.
   * @param url - The URL of the datamesh gateway.
   * @param authHeaders - The authentication headers.
   * @param parameters - Optional parameters for the request.
   * @param chunks - Optional chunking strategy.
   * @param downsample - Optional downsampling strategy.
   * @returns A promise that resolves to a Dataset instance.
   */
  @measureTime
  static async zarr(
    url: string,
    authHeaders: Record<string, string>,
    parameters?: Record<string, string | number>,
    chunks?: string,
    downsample?: Record<string, number>
  ): Promise<Dataset<DatameshStore>> {
    const store = await zarr.withConsolidated(
      new CachedHTTPStore(
        url,
        authHeaders,
        parameters,
        chunks,
        downsample,
        typeof window === "undefined"
      )
    );
    const root = await zarr.root(store);
    const group = await zarr.open(root, { kind: "group" });
    const data_vars = {} as Record<string, DataVar<DataType, DatameshStore>>;
    const dims = {} as Record<string, number>;
    for (const item of store.contents()) {
      if (item.kind == "array") {
        const arr = await zarr.open(root.resolve(item.path), { kind: "array" });
        const array_dims = arr.attrs._ARRAY_DIMENSIONS as string[] | null;
        const vid = item.path.split("/").pop() as string;
        data_vars[vid] = new DataVar<DataType, DatameshStore>(
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
    const coords = JSON.parse(
      group.attrs["_coordinates"] as string
    ) as Coordinates;
    return new Dataset<DatameshStore>(
      dims,
      data_vars,
      group.attrs,
      coords,
      root
    );
  }

  static async fromArrow(
    data: Table,
    coordmap: Coordinates
  ): Promise<Dataset<TempStore>> {
    const attrs = {};
    const dims = { record: data.numRows };
    const data_vars = {};
    data.schema.fields.forEach((field) => {
      const column = data.getChild(field.name);
      let array = column.toArray();
      if (ArrowDataType.isTimestamp(field.type)) {
        const carray = new Int32Array(array.length);
        const m = BigInt(1000 ** (field.type.unit - 1));
        for (let i = 0; i < array.length; i++) {
          carray[i] = Number(array[i] / m);
        }
        array = carray;
      } else if (ArrowDataType.isBinary(field.type)) {
        const carray = [];
        for (let i = 0; i < array.length; i++) {
          carray.push(Buffer(array[i]).toString("base64"));
        }
        array = carray;
      }
      data_vars[field.name] = {
        dims: ["record"],
        attrs: {},
        data: array,
      };
    });
    return await Dataset.init({ dims, data_vars, attrs }, coordmap);
  }

  /**
   * Initializes an in memory Dataset instance from a data object.
   * @param datasource - An object containing id, dimensions, data variables, and attributes.
   */
  static async init(
    datasource: Schema,
    coordinates?: Coordinates
  ): Promise<Dataset<TempStore>> {
    const root = zarr.root(new Map());
    const ds = new Dataset(
      datasource.dims,
      {},
      datasource.attrs || {},
      coordinates || {},
      root
    );
    for (const k in datasource.data_vars) {
      const { dims, attrs, data }: DataVariable = datasource.data_vars[k];
      await ds.assign(k, dims, data as Data, attrs);
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
  @measureTime
  async asDataframe(): Promise<Record<string, unknown>[]> {
    const data = {} as Record<string, DataVariable>;
    const bigint = [];
    for (const k in this.data_vars) {
      data[k] = {
        attrs: this.data_vars[k].attrs,
        dims: this.data_vars[k].dims,
      };
      data[k].data = (await this.data_vars[k].get()) as Data;
      if (this.data_vars[k].arr.type == "int64") {
        bigint.push(k);
      }
    }
    const df = flatten(data, { ...this.dims }, []);
    if (this.coordinates.t) {
      for (let i = 0; i < df.length; i++) {
        df[i][this.coordinates.t] = new Date(
          df[i][this.coordinates.t] as number
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
    if (!this.coordinates.g && !geom) {
      throw new Error("No geometry found");
    }
    const features = [];
    const df = await this.asDataframe();
    const encoder = new TextEncoder();
    for (let i = 0; i < df.length; i++) {
      const { ...properties } = df[i];
      if (this.coordinates.g && !geometry) {
        delete properties[this.coordinates.g];
        const geom = new Buffer(df[i][this.coordinates.g], "base64");
        geometry = wkx.Geometry.parse(geom).toGeoJSON();
      }
      features.push({
        type: "Feature",
        geometry,
        properties,
      });
    }
    return {
      type: "FeatureCollection",
      features: features,
    };
  }

  /**
   * Asynchronously assigns data to a variable in the dataset.
   *
   * @param varid - The identifier for the variable.
   * @param dims - An array of dimension names corresponding to the data.
   * @param data - The data to be assigned, which can be a multi-dimensional array.
   * @param attrs - Optional. A record of attributes to be associated with the variable.
   * @param coordinates - Optional. A record of coordinates to be associated with the variable.
   * @param chunks - Optional. An array specifying the chunk sizes for the data.
   
   * @returns A promise that resolves when the data has been successfully assigned.
   * @throws Will throw an error if the shape of the data does not match the provided dimensions.
   * @throws Will throw an error if an existing dimension size does not match the new data.
   */
  async assign(
    varid: string,
    dims: string[],
    data: Data,
    attrs?: Record<string, unknown>,
    coordinates?: Coordinates,
    chunks?: number[]
  ): Promise<void> {
    const shape = getShape(data);
    if (shape.length != dims.length) {
      throw new Error("Data shape does not match dimensions");
    }
    dims.map((dim, i) => {
      if (this.dims[dim]) {
        if (this.dims[dim] != shape[i]) {
          throw new Error(
            `Existing size of dimension ${dim} does not match new data`
          );
        }
      } else {
        this.dims[dim] = shape[i];
      }
    });
    const dtype = getDtype(data);
    const arr = await zarr.create(
      this.root.resolve(varid) as Location<Mutable>,
      {
        shape,
        data_type: dtype,
        chunk_shape: chunks || shape,
        codecs: dtype == "v2:object" ? [{ name: "json2" }] : [],
      }
    );
    await set(
      arr,
      shape.map(() => null),
      {
        data: ravel(data),
        shape: shape,
        stride: get_strides(shape),
      }
    );
    this.data_vars[varid] = new DataVar(varid, dims, attrs || {}, arr);
  }
}
