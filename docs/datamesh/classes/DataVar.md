[**@oceanum/datamesh**](../README.md)

***

[@oceanum/datamesh](../README.md) / DataVar

# Class: DataVar\<S\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:254](https://github.com/oceanum-io/oceanum-js/blob/4449d4b3fac355094039d4392e96edf8345b7153/packages/datamesh/src/lib/datamodel.ts#L254)

Represents a data variable within a dataset.

## Type Parameters

• **S** *extends* `TempZarr` \| `HttpZarr`

## Constructors

### new DataVar()

> **new DataVar**\<`S`\>(`id`, `dimensions`, `attributes`, `arr`): [`DataVar`](DataVar.md)\<`DType`, `S`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:272](https://github.com/oceanum-io/oceanum-js/blob/4449d4b3fac355094039d4392e96edf8345b7153/packages/datamesh/src/lib/datamodel.ts#L272)

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

[`DataVar`](DataVar.md)\<`DType`, `S`\>

## Properties

### arr

> **arr**: `S` *extends* `TempZarr` ? `Array`\<`DType`, `Mutable`\> : `Array`\<`DType`, `AsyncReadable`\<`unknown`\>\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:269](https://github.com/oceanum-io/oceanum-js/blob/4449d4b3fac355094039d4392e96edf8345b7153/packages/datamesh/src/lib/datamodel.ts#L269)

***

### attributes

> **attributes**: `Record`\<`string`, `unknown`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:268](https://github.com/oceanum-io/oceanum-js/blob/4449d4b3fac355094039d4392e96edf8345b7153/packages/datamesh/src/lib/datamodel.ts#L268)

***

### dimensions

> **dimensions**: `string`[]

Defined in: [packages/datamesh/src/lib/datamodel.ts:267](https://github.com/oceanum-io/oceanum-js/blob/4449d4b3fac355094039d4392e96edf8345b7153/packages/datamesh/src/lib/datamodel.ts#L267)

***

### id

> **id**: `string`

Defined in: [packages/datamesh/src/lib/datamodel.ts:266](https://github.com/oceanum-io/oceanum-js/blob/4449d4b3fac355094039d4392e96edf8345b7153/packages/datamesh/src/lib/datamodel.ts#L266)

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

> **get**(`index`?): `Promise`\<[`Data`](../type-aliases/Data.md)\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:293](https://github.com/oceanum-io/oceanum-js/blob/4449d4b3fac355094039d4392e96edf8345b7153/packages/datamesh/src/lib/datamodel.ts#L293)

Retrieves the data from the zarr array. If the data is already cached, it returns the cached data.

#### Parameters

##### index?

Optional slice parameters to retrieve specific data from the zarr array.

`string`[] | `SliceDef`

#### Returns

`Promise`\<[`Data`](../type-aliases/Data.md)\>

A promise that resolves to the data of the zarr array.
