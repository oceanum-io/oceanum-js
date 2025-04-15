[**@oceanum/datamesh**](../README.md)

***

[@oceanum/datamesh](../README.md) / Dataset

# Class: Dataset\<S\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:334](https://github.com/oceanum-io/oceanum-js/blob/4449d4b3fac355094039d4392e96edf8345b7153/packages/datamesh/src/lib/datamodel.ts#L334)

## Type Parameters

• **S** *extends* `HttpZarr` \| `TempZarr`

## Constructors

### new Dataset()

> **new Dataset**\<`S`\>(`dimensions`, `variables`, `attributes`, `coordkeys`, `root`): [`Dataset`](Dataset.md)\<`S`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:351](https://github.com/oceanum-io/oceanum-js/blob/4449d4b3fac355094039d4392e96edf8345b7153/packages/datamesh/src/lib/datamodel.ts#L351)

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

[`Dataset`](Dataset.md)\<`S`\>

## Properties

### attributes

> **attributes**: `Record`\<`string`, `unknown`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:347](https://github.com/oceanum-io/oceanum-js/blob/4449d4b3fac355094039d4392e96edf8345b7153/packages/datamesh/src/lib/datamodel.ts#L347)

***

### coordkeys

> **coordkeys**: [`Coordkeys`](../type-aliases/Coordkeys.md)

Defined in: [packages/datamesh/src/lib/datamodel.ts:348](https://github.com/oceanum-io/oceanum-js/blob/4449d4b3fac355094039d4392e96edf8345b7153/packages/datamesh/src/lib/datamodel.ts#L348)

***

### dimensions

> **dimensions**: `Record`\<`string`, `number`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:343](https://github.com/oceanum-io/oceanum-js/blob/4449d4b3fac355094039d4392e96edf8345b7153/packages/datamesh/src/lib/datamodel.ts#L343)

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

Defined in: [packages/datamesh/src/lib/datamodel.ts:349](https://github.com/oceanum-io/oceanum-js/blob/4449d4b3fac355094039d4392e96edf8345b7153/packages/datamesh/src/lib/datamodel.ts#L349)

***

### variables

> **variables**: `S` *extends* `TempZarr` ? `Record`\<`string`, [`DataVar`](DataVar.md)\<`DataType`, `TempZarr`\>\> : `Record`\<`string`, [`DataVar`](DataVar.md)\<`DataType`, `HttpZarr`\>\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:344](https://github.com/oceanum-io/oceanum-js/blob/4449d4b3fac355094039d4392e96edf8345b7153/packages/datamesh/src/lib/datamodel.ts#L344)

## Methods

### asDataframe()

> **asDataframe**(): `Promise`\<`Record`\<`string`, `unknown`\>[]\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:580](https://github.com/oceanum-io/oceanum-js/blob/4449d4b3fac355094039d4392e96edf8345b7153/packages/datamesh/src/lib/datamodel.ts#L580)

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

> **asGeojson**(`geom`?): `Promise`\<`FeatureCollection`\<`Geometry`, `GeoJsonProperties`\>\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:631](https://github.com/oceanum-io/oceanum-js/blob/4449d4b3fac355094039d4392e96edf8345b7153/packages/datamesh/src/lib/datamodel.ts#L631)

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

***

### assign()

> **assign**(`varid`, `dims`, `data`, `attrs`?, `dtype`?, `chunks`?): `Promise`\<`void`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:678](https://github.com/oceanum-io/oceanum-js/blob/4449d4b3fac355094039d4392e96edf8345b7153/packages/datamesh/src/lib/datamodel.ts#L678)

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

### fromArrow()

> `static` **fromArrow**(`data`, `coordkeys`): `Promise`\<[`Dataset`](Dataset.md)\<`TempZarr`\>\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:431](https://github.com/oceanum-io/oceanum-js/blob/4449d4b3fac355094039d4392e96edf8345b7153/packages/datamesh/src/lib/datamodel.ts#L431)

#### Parameters

##### data

`Table`

##### coordkeys

[`Coordkeys`](../type-aliases/Coordkeys.md)

#### Returns

`Promise`\<[`Dataset`](Dataset.md)\<`TempZarr`\>\>

***

### fromGeojson()

> `static` **fromGeojson**(`featureCollection`, `coordkeys`?): `Promise`\<[`Dataset`](Dataset.md)\<`TempZarr`\>\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:471](https://github.com/oceanum-io/oceanum-js/blob/4449d4b3fac355094039d4392e96edf8345b7153/packages/datamesh/src/lib/datamodel.ts#L471)

#### Parameters

##### featureCollection

`FeatureCollection`

##### coordkeys?

[`Coordkeys`](../type-aliases/Coordkeys.md)

#### Returns

`Promise`\<[`Dataset`](Dataset.md)\<`TempZarr`\>\>

***

### init()

> `static` **init**(`datasource`, `coordkeys`?): `Promise`\<[`Dataset`](Dataset.md)\<`TempZarr`\>\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:539](https://github.com/oceanum-io/oceanum-js/blob/4449d4b3fac355094039d4392e96edf8345b7153/packages/datamesh/src/lib/datamodel.ts#L539)

Initializes an in memory Dataset instance from a data object.

#### Parameters

##### datasource

[`Schema`](../type-aliases/Schema.md)

An object containing id, dimensions, data variables, and attributes.

##### coordkeys?

[`Coordkeys`](../type-aliases/Coordkeys.md)

#### Returns

`Promise`\<[`Dataset`](Dataset.md)\<`TempZarr`\>\>

***

### zarr()

> `static` **zarr**(`url`, `authHeaders`, `options`): `Promise`\<[`Dataset`](Dataset.md)\<`HttpZarr`\>\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:379](https://github.com/oceanum-io/oceanum-js/blob/4449d4b3fac355094039d4392e96edf8345b7153/packages/datamesh/src/lib/datamodel.ts#L379)

Creates a Dataset instance from a Zarr store.

#### Parameters

##### url

`string`

The URL of the datamesh gateway.

##### authHeaders

`Record`\<`string`, `string`\>

The authentication headers.

##### options

[`ZarrOptions`](../interfaces/ZarrOptions.md) = `{}`

#### Returns

`Promise`\<[`Dataset`](Dataset.md)\<`HttpZarr`\>\>

A promise that resolves to a Dataset instance.
