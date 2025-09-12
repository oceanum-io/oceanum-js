[**@oceanum/datamesh**](../README.md)

***

[@oceanum/datamesh](../README.md) / Dataset

# Class: Dataset\<S\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:378](https://github.com/oceanum-io/oceanum-js/blob/de54745f7642df8f064f1c2211b399c4854806ac/packages/datamesh/src/lib/datamodel.ts#L378)

## Type Parameters

### S

`S` *extends* `HttpZarr` \| `TempZarr`

## Constructors

### Constructor

> **new Dataset**\<`S`\>(`dimensions`, `variables`, `attributes`, `coordkeys`, `root`): `Dataset`\<`S`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:395](https://github.com/oceanum-io/oceanum-js/blob/de54745f7642df8f064f1c2211b399c4854806ac/packages/datamesh/src/lib/datamodel.ts#L395)

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

Defined in: [packages/datamesh/src/lib/datamodel.ts:391](https://github.com/oceanum-io/oceanum-js/blob/de54745f7642df8f064f1c2211b399c4854806ac/packages/datamesh/src/lib/datamodel.ts#L391)

***

### coordkeys

> **coordkeys**: [`Coordkeys`](../type-aliases/Coordkeys.md)

Defined in: [packages/datamesh/src/lib/datamodel.ts:392](https://github.com/oceanum-io/oceanum-js/blob/de54745f7642df8f064f1c2211b399c4854806ac/packages/datamesh/src/lib/datamodel.ts#L392)

***

### dimensions

> **dimensions**: `Record`\<`string`, `number`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:387](https://github.com/oceanum-io/oceanum-js/blob/de54745f7642df8f064f1c2211b399c4854806ac/packages/datamesh/src/lib/datamodel.ts#L387)

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

Defined in: [packages/datamesh/src/lib/datamodel.ts:393](https://github.com/oceanum-io/oceanum-js/blob/de54745f7642df8f064f1c2211b399c4854806ac/packages/datamesh/src/lib/datamodel.ts#L393)

***

### variables

> **variables**: `S` *extends* `TempZarr` ? `Record`\<`string`, [`DataVar`](DataVar.md)\<`DataType`, `TempZarr`\>\> : `Record`\<`string`, [`DataVar`](DataVar.md)\<`DataType`, `HttpZarr`\>\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:388](https://github.com/oceanum-io/oceanum-js/blob/de54745f7642df8f064f1c2211b399c4854806ac/packages/datamesh/src/lib/datamodel.ts#L388)

## Methods

### asDataframe()

> **asDataframe**(): `Promise`\<`Record`\<`string`, `unknown`\>[]\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:650](https://github.com/oceanum-io/oceanum-js/blob/de54745f7642df8f064f1c2211b399c4854806ac/packages/datamesh/src/lib/datamodel.ts#L650)

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

> **asGeojson**(`geometry?`): `Promise`\<`FeatureCollection`\<`Geometry`, `GeoJsonProperties`\>\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:701](https://github.com/oceanum-io/oceanum-js/blob/de54745f7642df8f064f1c2211b399c4854806ac/packages/datamesh/src/lib/datamodel.ts#L701)

Converts the dataset into a GeoJSON Feature.

#### Parameters

##### geometry?

`Geometry`

Optional GeoJSON geometry to apply to all records, otherwise geometry column is required. Will override geometry column if present.

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

> **assign**(`varid`, `dims`, `data`, `attrs?`, `dtype?`, `chunks?`): `Promise`\<`void`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:747](https://github.com/oceanum-io/oceanum-js/blob/de54745f7642df8f064f1c2211b399c4854806ac/packages/datamesh/src/lib/datamodel.ts#L747)

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

> `static` **fromArrow**(`data`, `coordkeys`): `Promise`\<`Dataset`\<`TempZarr`\>\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:491](https://github.com/oceanum-io/oceanum-js/blob/de54745f7642df8f064f1c2211b399c4854806ac/packages/datamesh/src/lib/datamodel.ts#L491)

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

Defined in: [packages/datamesh/src/lib/datamodel.ts:531](https://github.com/oceanum-io/oceanum-js/blob/de54745f7642df8f064f1c2211b399c4854806ac/packages/datamesh/src/lib/datamodel.ts#L531)

#### Parameters

##### geojson

`FeatureCollection`\<`Geometry`, `GeoJsonProperties`\> | `Feature`\<`Geometry`, `GeoJsonProperties`\>

##### coordkeys?

[`Coordkeys`](../type-aliases/Coordkeys.md)

#### Returns

`Promise`\<`Dataset`\<`TempZarr`\>\>

***

### init()

> `static` **init**(`datasource`, `coordkeys?`): `Promise`\<`Dataset`\<`TempZarr`\>\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:603](https://github.com/oceanum-io/oceanum-js/blob/de54745f7642df8f064f1c2211b399c4854806ac/packages/datamesh/src/lib/datamodel.ts#L603)

Initializes an in memory Dataset instance from a data object.

#### Parameters

##### datasource

[`Schema`](../type-aliases/Schema.md)

An object containing id, dimensions, data variables, and attributes.

##### coordkeys?

[`Coordkeys`](../type-aliases/Coordkeys.md)

#### Returns

`Promise`\<`Dataset`\<`TempZarr`\>\>

***

### zarr()

> `static` **zarr**(`url`, `authHeaders`, `options`): `Promise`\<`Dataset`\<`HttpZarr`\>\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:424](https://github.com/oceanum-io/oceanum-js/blob/de54745f7642df8f064f1c2211b399c4854806ac/packages/datamesh/src/lib/datamodel.ts#L424)

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

`Promise`\<`Dataset`\<`HttpZarr`\>\>

A promise that resolves to a Dataset instance.
