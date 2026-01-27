[**@oceanum/datamesh**](../../README.md)

***

[@oceanum/datamesh](../../README.md) / [index](../README.md) / DataVar

# Class: DataVar\<S\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:437](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/datamodel.ts#L437)

Represents a data variable within a dataset.

## Type Parameters

### S

`S` *extends* `TempZarr` \| `HttpZarr`

## Constructors

### Constructor

> **new DataVar**\<`S`\>(`id`, `dimensions`, `attributes`, `arr`): `DataVar`\<`DType`, `S`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:455](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/datamodel.ts#L455)

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

Defined in: [packages/datamesh/src/lib/datamodel.ts:452](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/datamodel.ts#L452)

***

### attributes

> **attributes**: `Record`\<`string`, `unknown`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:451](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/datamodel.ts#L451)

***

### dimensions

> **dimensions**: `string`[]

Defined in: [packages/datamesh/src/lib/datamodel.ts:450](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/datamodel.ts#L450)

***

### id

> **id**: `string`

Defined in: [packages/datamesh/src/lib/datamodel.ts:449](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/datamodel.ts#L449)

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

Defined in: [packages/datamesh/src/lib/datamodel.ts:476](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/datamodel.ts#L476)

Retrieves the data from the zarr array. If the data is already cached, it returns the cached data.

#### Parameters

##### index?

Optional slice parameters to retrieve specific data from the zarr array.

`string`[] | `SliceDef`

#### Returns

`Promise`\<[`Data`](../type-aliases/Data.md)\>

A promise that resolves to the data of the zarr array.
