[**@oceanum/datamesh**](../README.md)

***

[@oceanum/datamesh](../README.md) / Dataset

# Class: Dataset

Represents a dataset with dimensions, data variables, and attributes.
Implements the DatasetApi interface.

## Constructors

### new Dataset()

> **new Dataset**\<\>(`dimensions`, `variables`, `attributes`, `coordmap`, `root`): [`Dataset`](Dataset.md)\<`S`\>

#### Parameters

##### dimensions

`Record`\<`string`, `number`\>

##### variables

`S` *extends* `TempStore` ? `Record`\<`string`, [`DataVar`](DataVar.md)\<`DataType`, `TempStore`\>\> : `Record`\<`string`, [`DataVar`](DataVar.md)\<`DataType`, `DatameshStore`\>\>

##### attributes

`Record`\<`string`, `unknown`\>

##### coordmap

[`Coordmap`](../type-aliases/Coordmap.md)

##### root

`S`

#### Returns

[`Dataset`](Dataset.md)\<`S`\>

#### Defined in

[packages/datamesh/src/lib/datamodel.ts:343](https://github.com/oceanum-io/oceanum-js/blob/8743de96e5f943db8ec0df1328a02f233bca002b/packages/datamesh/src/lib/datamodel.ts#L343)

## Properties

### attributes

> **attributes**: `Record`\<`string`, `unknown`\>

#### Defined in

[packages/datamesh/src/lib/datamodel.ts:339](https://github.com/oceanum-io/oceanum-js/blob/8743de96e5f943db8ec0df1328a02f233bca002b/packages/datamesh/src/lib/datamodel.ts#L339)

***

### coordmap

> **coordmap**: [`Coordmap`](../type-aliases/Coordmap.md)

#### Defined in

[packages/datamesh/src/lib/datamodel.ts:340](https://github.com/oceanum-io/oceanum-js/blob/8743de96e5f943db8ec0df1328a02f233bca002b/packages/datamesh/src/lib/datamodel.ts#L340)

***

### dimensions

> **dimensions**: `Record`\<`string`, `number`\>

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

#### Defined in

[packages/datamesh/src/lib/datamodel.ts:335](https://github.com/oceanum-io/oceanum-js/blob/8743de96e5f943db8ec0df1328a02f233bca002b/packages/datamesh/src/lib/datamodel.ts#L335)

***

### root

> **root**: `S`

#### Defined in

[packages/datamesh/src/lib/datamodel.ts:341](https://github.com/oceanum-io/oceanum-js/blob/8743de96e5f943db8ec0df1328a02f233bca002b/packages/datamesh/src/lib/datamodel.ts#L341)

***

### variables

> **variables**: `S` *extends* `TempStore` ? `Record`\<`string`, [`DataVar`](DataVar.md)\<`DataType`, `TempStore`\>\> : `Record`\<`string`, [`DataVar`](DataVar.md)\<`DataType`, `DatameshStore`\>\>

#### Defined in

[packages/datamesh/src/lib/datamodel.ts:336](https://github.com/oceanum-io/oceanum-js/blob/8743de96e5f943db8ec0df1328a02f233bca002b/packages/datamesh/src/lib/datamodel.ts#L336)

## Methods

### asDataframe()

> **asDataframe**(): `Promise`\<`Record`\<`string`, `unknown`\>[]\>

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

#### Defined in

[packages/datamesh/src/lib/datamodel.ts:567](https://github.com/oceanum-io/oceanum-js/blob/8743de96e5f943db8ec0df1328a02f233bca002b/packages/datamesh/src/lib/datamodel.ts#L567)

***

### asGeojson()

> **asGeojson**(`geom`?): `Promise`\<`FeatureCollection`\<`Geometry`, `GeoJsonProperties`\>\>

Converts the dataset into a GeoJSON Feature.

#### Parameters

##### geom?

`Geometry`

#### Returns

`Promise`\<`FeatureCollection`\<`Geometry`, `GeoJsonProperties`\>\>

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

#### Defined in

[packages/datamesh/src/lib/datamodel.ts:618](https://github.com/oceanum-io/oceanum-js/blob/8743de96e5f943db8ec0df1328a02f233bca002b/packages/datamesh/src/lib/datamodel.ts#L618)

***

### assign()

> **assign**(`varid`, `dims`, `data`, `attrs`?, `dtype`?, `chunks`?): `Promise`\<`void`\>

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

#### Defined in

[packages/datamesh/src/lib/datamodel.ts:665](https://github.com/oceanum-io/oceanum-js/blob/8743de96e5f943db8ec0df1328a02f233bca002b/packages/datamesh/src/lib/datamodel.ts#L665)

***

### fromArrow()

> `static` **fromArrow**(`data`, `coordmap`): `Promise`\<[`Dataset`](Dataset.md)\<`TempStore`\>\>

#### Parameters

##### data

`Table`\<`any`\>

##### coordmap

[`Coordmap`](../type-aliases/Coordmap.md)

#### Returns

`Promise`\<[`Dataset`](Dataset.md)\<`TempStore`\>\>

#### Defined in

[packages/datamesh/src/lib/datamodel.ts:420](https://github.com/oceanum-io/oceanum-js/blob/8743de96e5f943db8ec0df1328a02f233bca002b/packages/datamesh/src/lib/datamodel.ts#L420)

***

### fromGeojson()

> `static` **fromGeojson**(`featureCollection`, `coordmap`?): `Promise`\<[`Dataset`](Dataset.md)\<`TempStore`\>\>

#### Parameters

##### featureCollection

`FeatureCollection`\<`Geometry`, `GeoJsonProperties`\>

##### coordmap?

[`Coordmap`](../type-aliases/Coordmap.md)

#### Returns

`Promise`\<[`Dataset`](Dataset.md)\<`TempStore`\>\>

#### Defined in

[packages/datamesh/src/lib/datamodel.ts:460](https://github.com/oceanum-io/oceanum-js/blob/8743de96e5f943db8ec0df1328a02f233bca002b/packages/datamesh/src/lib/datamodel.ts#L460)

***

### init()

> `static` **init**(`datasource`, `coordmap`?): `Promise`\<[`Dataset`](Dataset.md)\<`TempStore`\>\>

Initializes an in memory Dataset instance from a data object.

#### Parameters

##### datasource

[`Schema`](../type-aliases/Schema.md)

An object containing id, dimensions, data variables, and attributes.

##### coordmap?

[`Coordmap`](../type-aliases/Coordmap.md)

#### Returns

`Promise`\<[`Dataset`](Dataset.md)\<`TempStore`\>\>

#### Defined in

[packages/datamesh/src/lib/datamodel.ts:528](https://github.com/oceanum-io/oceanum-js/blob/8743de96e5f943db8ec0df1328a02f233bca002b/packages/datamesh/src/lib/datamodel.ts#L528)

***

### zarr()

> `static` **zarr**(`url`, `authHeaders`, `parameters`?, `chunks`?, `downsample`?): `Promise`\<[`Dataset`](Dataset.md)\<`DatameshStore`\>\>

Creates a Dataset instance from a Zarr store.

#### Parameters

##### url

`string`

The URL of the datamesh gateway.

##### authHeaders

`Record`\<`string`, `string`\>

The authentication headers.

##### parameters?

`Record`\<`string`, `string` \| `number`\>

Optional parameters for the request.

##### chunks?

`string`

Optional chunking strategy.

##### downsample?

`Record`\<`string`, `number`\>

Optional downsampling strategy.

#### Returns

`Promise`\<[`Dataset`](Dataset.md)\<`DatameshStore`\>\>

A promise that resolves to a Dataset instance.

#### Defined in

[packages/datamesh/src/lib/datamodel.ts:369](https://github.com/oceanum-io/oceanum-js/blob/8743de96e5f943db8ec0df1328a02f233bca002b/packages/datamesh/src/lib/datamodel.ts#L369)
