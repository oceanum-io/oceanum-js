[**@oceanum/datamesh**](../README.md) • **Docs**

***

[@oceanum/datamesh](../README.md) / Dataset

# Class: Dataset

Represents a dataset with dimensions, data variables, and attributes.
Implements the DatasetApi interface.

## Constructors

### new Dataset()

> **new Dataset**\<\>(`dims`, `data_vars`, `attrs`, `root`): [`Dataset`](Dataset.md)\<`S`\>

#### Parameters

• **dims**: `Record`\<`string`, `number`\>

• **data\_vars**: `S` *extends* `TempStore` ? `Record`\<`string`, [`DataVar`](DataVar.md)\<`DataType`, `TempStore`\>\> : `Record`\<`string`, [`DataVar`](DataVar.md)\<`DataType`, `DatameshStore`\>\>

• **attrs**: `Record`\<`string`, `unknown`\>

• **root**: `S`

#### Returns

[`Dataset`](Dataset.md)\<`S`\>

#### Defined in

[datamodel.ts:292](https://github.com/oceanum-io/oceanum-js/blob/16e7839874a87c82d4c481b562840bf7ccac2d83/packages/datamesh/src/lib/datamodel.ts#L292)

## Properties

### attrs

> **attrs**: `Record`\<`string`, `unknown`\>

#### Defined in

[datamodel.ts:289](https://github.com/oceanum-io/oceanum-js/blob/16e7839874a87c82d4c481b562840bf7ccac2d83/packages/datamesh/src/lib/datamodel.ts#L289)

***

### data\_vars

> **data\_vars**: `S` *extends* `TempStore` ? `Record`\<`string`, [`DataVar`](DataVar.md)\<`DataType`, `TempStore`\>\> : `Record`\<`string`, [`DataVar`](DataVar.md)\<`DataType`, `DatameshStore`\>\>

#### Defined in

[datamodel.ts:286](https://github.com/oceanum-io/oceanum-js/blob/16e7839874a87c82d4c481b562840bf7ccac2d83/packages/datamesh/src/lib/datamodel.ts#L286)

***

### dims

> **dims**: `Record`\<`string`, `number`\>

Creates an instance of Dataset.

#### Param

The dimensions of the dataset.

#### Param

The data variables of the dataset.

#### Param

The attributes of the dataset.

#### Param

The root group of the dataset.

#### Defined in

[datamodel.ts:285](https://github.com/oceanum-io/oceanum-js/blob/16e7839874a87c82d4c481b562840bf7ccac2d83/packages/datamesh/src/lib/datamodel.ts#L285)

***

### root

> **root**: `S`

#### Defined in

[datamodel.ts:290](https://github.com/oceanum-io/oceanum-js/blob/16e7839874a87c82d4c481b562840bf7ccac2d83/packages/datamesh/src/lib/datamodel.ts#L290)

## Methods

### assign()

> **assign**(`varid`, `dims`, `data`, `attrs`?, `chunks`?): `Promise`\<`void`\>

Asynchronously assigns data to a variable in the dataset.

#### Parameters

• **varid**: `string`

The identifier for the variable.

• **dims**: `string`[]

An array of dimension names corresponding to the data.

• **data**: [`Data`](../type-aliases/Data.md)

The data to be assigned, which can be a multi-dimensional array.

• **attrs?**: `Record`\<`string`, `unknown`\>

Optional. A record of attributes to be associated with the variable.

• **chunks?**: `number`[]

Optional. An array specifying the chunk sizes for the data.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the data has been successfully assigned.

#### Throws

Will throw an error if the shape of the data does not match the provided dimensions.

#### Throws

Will throw an error if an existing dimension size does not match the new data.

#### Defined in

[datamodel.ts:418](https://github.com/oceanum-io/oceanum-js/blob/16e7839874a87c82d4c481b562840bf7ccac2d83/packages/datamesh/src/lib/datamodel.ts#L418)

***

### to\_dataframe()

> **to\_dataframe**(): `Promise`\<`Record`\<`string`, `unknown`\>[]\>

Converts the data variables into a dataframe format.

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>[]\>

A promise that resolves to an array of records,
where each record represents a row in the dataframe.

#### Remarks

This method iterates over the data variables, retrieves their dimensions and data,
and then flattens the data into a dataframe structure.

#### Example

```typescript
const dataframe = await instance.to_dataframe();
console.log(dataframe);
```

#### Defined in

[datamodel.ts:393](https://github.com/oceanum-io/oceanum-js/blob/16e7839874a87c82d4c481b562840bf7ccac2d83/packages/datamesh/src/lib/datamodel.ts#L393)

***

### init()

> `static` **init**(`datasource`): `Promise`\<[`Dataset`](Dataset.md)\<`TempStore`\>\>

Initializes an in memory Dataset instance from a data object.

#### Parameters

• **datasource**: [`Schema`](../type-aliases/Schema.md)

An object containing id, dimensions, data variables, and attributes.

#### Returns

`Promise`\<[`Dataset`](Dataset.md)\<`TempStore`\>\>

#### Defined in

[datamodel.ts:367](https://github.com/oceanum-io/oceanum-js/blob/16e7839874a87c82d4c481b562840bf7ccac2d83/packages/datamesh/src/lib/datamodel.ts#L367)

***

### zarr()

> `static` **zarr**(`url`, `authHeaders`, `parameters`?, `chunks`?, `downsample`?): `Promise`\<[`Dataset`](Dataset.md)\<`DatameshStore`\>\>

Creates a Dataset instance from a Zarr store.

#### Parameters

• **url**: `string`

The URL of the datamesh gateway.

• **authHeaders**: `Record`\<`string`, `string`\>

The authentication headers.

• **parameters?**: `Record`\<`string`, `string` \| `number`\>

Optional parameters for the request.

• **chunks?**: `string`

Optional chunking strategy.

• **downsample?**: `Record`\<`string`, `number`\>

Optional downsampling strategy.

#### Returns

`Promise`\<[`Dataset`](Dataset.md)\<`DatameshStore`\>\>

A promise that resolves to a Dataset instance.

#### Defined in

[datamodel.ts:315](https://github.com/oceanum-io/oceanum-js/blob/16e7839874a87c82d4c481b562840bf7ccac2d83/packages/datamesh/src/lib/datamodel.ts#L315)
