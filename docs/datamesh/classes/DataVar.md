[**@oceanum/datamesh**](../README.md) • **Docs**

***

[@oceanum/datamesh](../README.md) / DataVar

# Class: DataVar\<S\>

Represents a data variable within a dataset.

## Type Parameters

• **S** *extends* `TempStore` \| `DatameshStore`

## Constructors

### new DataVar()

> **new DataVar**\<`S`\>(`id`, `dims`, `attrs`, `arr`): [`DataVar`](DataVar.md)\<`DType`, `S`\>

#### Parameters

• **id**: `string`

• **dims**: `string`[]

• **attrs**: `Record`\<`string`, `unknown`\>

• **arr**: `S` *extends* `TempStore` ? `Array`\<`DType`, `Mutable`\> : `Array`\<`DType`, `AsyncReadable`\<`unknown`\>\>

#### Returns

[`DataVar`](DataVar.md)\<`DType`, `S`\>

#### Defined in

[datamodel.ts:238](https://github.com/oceanum-io/oceanum-js/blob/16e7839874a87c82d4c481b562840bf7ccac2d83/packages/datamesh/src/lib/datamodel.ts#L238)

## Properties

### arr

> **arr**: `S` *extends* `TempStore` ? `Array`\<`DType`, `Mutable`\> : `Array`\<`DType`, `AsyncReadable`\<`unknown`\>\>

#### Defined in

[datamodel.ts:235](https://github.com/oceanum-io/oceanum-js/blob/16e7839874a87c82d4c481b562840bf7ccac2d83/packages/datamesh/src/lib/datamodel.ts#L235)

***

### attrs

> **attrs**: `Record`\<`string`, `unknown`\>

#### Defined in

[datamodel.ts:234](https://github.com/oceanum-io/oceanum-js/blob/16e7839874a87c82d4c481b562840bf7ccac2d83/packages/datamesh/src/lib/datamodel.ts#L234)

***

### dims

> **dims**: `string`[]

#### Defined in

[datamodel.ts:233](https://github.com/oceanum-io/oceanum-js/blob/16e7839874a87c82d4c481b562840bf7ccac2d83/packages/datamesh/src/lib/datamodel.ts#L233)

***

### id

> **id**: `string`

Creates an instance of DataVar.

#### Param

The identifier for the data variable.

#### Param

The dimensions associated with the data variable.

#### Param

The attributes of the data variable, represented as a record of key-value pairs.

#### Param

The zarr array associated with the data variable.

#### Defined in

[datamodel.ts:232](https://github.com/oceanum-io/oceanum-js/blob/16e7839874a87c82d4c481b562840bf7ccac2d83/packages/datamesh/src/lib/datamodel.ts#L232)

## Methods

### get()

> **get**(`slice`?): `Promise`\<[`Data`](../type-aliases/Data.md)\>

Retrieves the data from the zarr array. If the data is already cached, it returns the cached data.

#### Parameters

• **slice?**: `null` \| (`null` \| `number` \| `Slice`)[]

Optional slice parameters to retrieve specific data from the zarr array.

#### Returns

`Promise`\<[`Data`](../type-aliases/Data.md)\>

A promise that resolves to the data of the zarr array.

#### Defined in

[datamodel.ts:258](https://github.com/oceanum-io/oceanum-js/blob/16e7839874a87c82d4c481b562840bf7ccac2d83/packages/datamesh/src/lib/datamodel.ts#L258)
