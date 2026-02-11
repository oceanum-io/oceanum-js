[**@oceanum/datamesh**](../../README.md)

***

[@oceanum/datamesh](../../README.md) / [index](../README.md) / Dataset

# Class: Dataset\<S\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:566](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L566)

## Type Parameters

### S

`S` *extends* `HttpZarr` \| `TempZarr`

## Constructors

### Constructor

> **new Dataset**\<`S`\>(`dimensions`, `variables`, `attributes`, `coordkeys`, `root`): `Dataset`\<`S`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:583](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L583)

#### Parameters

##### dimensions

`Record`\<`string`, `number`\>

##### variables

`S` *extends* `TempZarr` ? `Record`\<`string`, [`DataVar`](DataVar.md)\<`DataType`, `TempZarr`\>\> : `Record`\<`string`, [`DataVar`](DataVar.md)\<`DataType`, `HttpZarr`\>\>

##### attributes

`Record`\<`string`, `unknown`\>

##### coordkeys

[`Coordkeys`](../type-aliases/Coordkeys.md)

##### root

`S`

#### Returns

`Dataset`\<`S`\>

## Properties

### attributes

> **attributes**: `Record`\<`string`, `unknown`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:579](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L579)

***

### coordkeys

> **coordkeys**: [`Coordkeys`](../type-aliases/Coordkeys.md)

Defined in: [packages/datamesh/src/lib/datamodel.ts:580](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L580)

***

### dimensions

> **dimensions**: `Record`\<`string`, `number`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:575](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L575)

Creates an instance of Dataset.

#### Param

The dimensions of the dataset.

#### Param

The data variables of the dataset.

#### Param

The attributes of the dataset.

#### Param

The root group of the dataset.

#### Param

The coordinates map of the dataset.

***

### root

> **root**: `S`

Defined in: [packages/datamesh/src/lib/datamodel.ts:581](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L581)

***

### variables

> **variables**: `S` *extends* `TempZarr` ? `Record`\<`string`, [`DataVar`](DataVar.md)\<`DataType`, `TempZarr`\>\> : `Record`\<`string`, [`DataVar`](DataVar.md)\<`DataType`, `HttpZarr`\>\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:576](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L576)

## Methods

### asDataframe()

> **asDataframe**(): `Promise`\<`Record`\<`string`, `unknown`\>[]\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:920](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L920)

Converts the dataset into a dataframe format.

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>[]\>

A promise that resolves to an array of records,
where each record represents a row in the dataframe.

#### Remarks

This method iterates over the data variables, retrieves their dimensions and data,
and then flattens the data into a dataframe structure.
Time coordinates are converted to IDO8601 format.
BigInt datatypes are coerced to number.

#### Example

```typescript
const dataframe = await instance.asDataframe();
console.log(dataframe);
```

***

### asGeojson()

> **asGeojson**(`geometry?`): `Promise`\<`FeatureCollection`\<`Geometry`, \{\[`name`: `string`\]: `any`; \}\>\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:971](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L971)

Converts the dataset into a GeoJSON Feature.

#### Parameters

##### geometry?

`Geometry`

Optional GeoJSON geometry to apply to all records, otherwise geometry column is required. Will override geometry column if present.

#### Returns

`Promise`\<`FeatureCollection`\<`Geometry`, \{\[`name`: `string`\]: `any`; \}\>\>

A promise that resolves to an array of records,
where each record represents a row in the dataframe.

#### Throws

Will throw an error if no geometry is found in data or as a parameter

#### Remarks

This method iterates over the data variables, retrieves their dimensions and data,
and then flattens the data into a dataframe structure.

#### Example

```typescript
const dataframe = await instance.asDataframe();
console.log(dataframe);
```

***

### assign()

> **assign**(`varid`, `dims`, `data`, `attrs?`, `dtype?`, `chunks?`): `Promise`\<`void`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:1017](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L1017)

Asynchronously assigns data to a variable in the dataset.

#### Parameters

##### varid

`string`

The identifier for the variable.

##### dims

`string`[]

An array of dimension names corresponding to the data.

##### data

[`Data`](../type-aliases/Data.md)

The data to be assigned, which can be a multi-dimensional array.

##### attrs?

`Record`\<`string`, `unknown`\>

Optional. A record of attributes to be associated with the variable.

##### dtype?

`DataType`

Optional. The data type of the data.

##### chunks?

`number`[]

Optional. An array specifying the chunk sizes for the data.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the data has been successfully assigned.

#### Throws

Will throw an error if the shape of the data does not match the provided dimensions.

#### Throws

Will throw an error if an existing dimension size does not match the new data.

***

### toZarr()

> **toZarr**(`options?`): `Promise`\<`Map`\<`string`, `Uint8Array`\<`ArrayBufferLike`\>\>\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:1104](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L1104)

Exports the dataset to a zarr format represented as a Map of path-to-data.
This can be used for serialization or writing to a zarr store.

#### Parameters

##### options?

[`ZarrWriteOptions`](../type-aliases/ZarrWriteOptions.md)

Optional configuration for the zarr output.

#### Returns

`Promise`\<`Map`\<`string`, `Uint8Array`\<`ArrayBufferLike`\>\>\>

A promise that resolves to a Map containing the zarr store data.

#### Example

```typescript
const zarrStore = await dataset.toZarr();
// zarrStore is a Map<string, Uint8Array>
```

***

### fromArrow()

> `static` **fromArrow**(`data`, `coordkeys`): `Promise`\<`Dataset`\<`TempZarr`\>\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:749](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L749)

#### Parameters

##### data

`Table`

##### coordkeys

[`Coordkeys`](../type-aliases/Coordkeys.md)

#### Returns

`Promise`\<`Dataset`\<`TempZarr`\>\>

***

### fromGeojson()

> `static` **fromGeojson**(`geojson`, `coordkeys?`): `Promise`\<`Dataset`\<`TempZarr`\>\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:789](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L789)

#### Parameters

##### geojson

`Feature`\<`Geometry`, \{\[`name`: `string`\]: `any`; \}\> | `FeatureCollection`\<`Geometry`, \{\[`name`: `string`\]: `any`; \}\>

##### coordkeys?

[`Coordkeys`](../type-aliases/Coordkeys.md)

#### Returns

`Promise`\<`Dataset`\<`TempZarr`\>\>

***

### init()

> `static` **init**(`datasource`, `coordkeys?`, `chunkConfig?`): `Promise`\<`Dataset`\<`TempZarr`\>\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:863](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L863)

Initializes an in memory Dataset instance from a data object.

#### Parameters

##### datasource

[`Schema`](../type-aliases/Schema.md)

An object containing id, dimensions, data variables, and attributes.

##### coordkeys?

[`Coordkeys`](../type-aliases/Coordkeys.md)

Optional coordinate key mappings.

##### chunkConfig?

[`ChunkConfig`](../type-aliases/ChunkConfig.md)

Optional chunk configuration for global and per-variable chunking.

#### Returns

`Promise`\<`Dataset`\<`TempZarr`\>\>

***

### zarr()

> `static` **zarr**(`url`, `authHeaders`, `options?`): `Promise`\<`Dataset`\<`HttpZarr`\>\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:612](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L612)

Creates a Dataset instance from a Zarr store.

#### Parameters

##### url

`string`

The URL of the datamesh gateway.

##### authHeaders

`Record`\<`string`, `string`\>

The authentication headers.

##### options?

[`ZarrOptions`](../interfaces/ZarrOptions.md) = `{}`

#### Returns

`Promise`\<`Dataset`\<`HttpZarr`\>\>

A promise that resolves to a Dataset instance.
