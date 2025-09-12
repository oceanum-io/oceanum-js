[**@oceanum/datamesh**](../../README.md)

***

[@oceanum/datamesh](../../README.md) / [index](../README.md) / DataVar

# Class: DataVar\<S\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:287](https://github.com/oceanum-io/oceanum-js/blob/3690a65f9299651d3a3a5e315b93a4a92e341aa0/packages/datamesh/src/lib/datamodel.ts#L287)

Represents a data variable within a dataset.

## Type Parameters

### S

`S` *extends* `TempZarr` \| `HttpZarr`

## Constructors

### Constructor

> **new DataVar**\<`S`\>(`id`, `dimensions`, `attributes`, `arr`): `DataVar`\<`DType`, `S`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:305](https://github.com/oceanum-io/oceanum-js/blob/3690a65f9299651d3a3a5e315b93a4a92e341aa0/packages/datamesh/src/lib/datamodel.ts#L305)

#### Parameters

##### id

`string`

##### dimensions

`string`[]

##### attributes

`Record`\<`string`, `unknown`\>

##### arr

`S` *extends* `TempZarr` ? `Array`\<`DType`, `Mutable`\> : `Array`\<`DType`, `AsyncReadable`\<`unknown`\>\>

#### Returns

`DataVar`\<`DType`, `S`\>

## Properties

### arr

> **arr**: `S` *extends* `TempZarr` ? `Array`\<`DType`, `Mutable`\> : `Array`\<`DType`, `AsyncReadable`\<`unknown`\>\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:302](https://github.com/oceanum-io/oceanum-js/blob/3690a65f9299651d3a3a5e315b93a4a92e341aa0/packages/datamesh/src/lib/datamodel.ts#L302)

***

### attributes

> **attributes**: `Record`\<`string`, `unknown`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:301](https://github.com/oceanum-io/oceanum-js/blob/3690a65f9299651d3a3a5e315b93a4a92e341aa0/packages/datamesh/src/lib/datamodel.ts#L301)

***

### dimensions

> **dimensions**: `string`[]

Defined in: [packages/datamesh/src/lib/datamodel.ts:300](https://github.com/oceanum-io/oceanum-js/blob/3690a65f9299651d3a3a5e315b93a4a92e341aa0/packages/datamesh/src/lib/datamodel.ts#L300)

***

### id

> **id**: `string`

Defined in: [packages/datamesh/src/lib/datamodel.ts:299](https://github.com/oceanum-io/oceanum-js/blob/3690a65f9299651d3a3a5e315b93a4a92e341aa0/packages/datamesh/src/lib/datamodel.ts#L299)

Creates an instance of DataVar.

#### Param

The identifier for the data variable.

#### Param

The dimensions associated with the data variable.

#### Param

The attributes of the data variable, represented as a record of key-value pairs.

#### Param

The zarr array associated with the data variable.

## Methods

### get()

> **get**(`index?`): `Promise`\<[`Data`](../type-aliases/Data.md)\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:326](https://github.com/oceanum-io/oceanum-js/blob/3690a65f9299651d3a3a5e315b93a4a92e341aa0/packages/datamesh/src/lib/datamodel.ts#L326)

Retrieves the data from the zarr array. If the data is already cached, it returns the cached data.

#### Parameters

##### index?

Optional slice parameters to retrieve specific data from the zarr array.

`string`[] | `SliceDef`

#### Returns

`Promise`\<[`Data`](../type-aliases/Data.md)\>

A promise that resolves to the data of the zarr array.
