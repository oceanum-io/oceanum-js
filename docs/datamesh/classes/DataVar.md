[**@oceanum/datamesh**](../README.md)

***

[@oceanum/datamesh](../README.md) / DataVar

# Class: DataVar\<S\>

Represents a data variable within a dataset.

## Type Parameters

• **S** *extends* `TempStore` \| `DatameshStore`

## Constructors

### new DataVar()

> **new DataVar**\<`S`\>(`id`, `dimensions`, `attributes`, `arr`): [`DataVar`](DataVar.md)\<`DType`, `S`\>

#### Parameters

##### id

`string`

##### dimensions

`string`[]

##### attributes

`Record`\<`string`, `unknown`\>

##### arr

`S` *extends* `TempStore` ? `Array`\<`DType`, `Mutable`\> : `Array`\<`DType`, `AsyncReadable`\<`unknown`\>\>

#### Returns

[`DataVar`](DataVar.md)\<`DType`, `S`\>

#### Defined in

[packages/datamesh/src/lib/datamodel.ts:272](https://github.com/oceanum-io/oceanum-js/blob/b819c1f297a41b7ce9644bbdd1734c693df7b2fd/packages/datamesh/src/lib/datamodel.ts#L272)

## Properties

### arr

> **arr**: `S` *extends* `TempStore` ? `Array`\<`DType`, `Mutable`\> : `Array`\<`DType`, `AsyncReadable`\<`unknown`\>\>

#### Defined in

[packages/datamesh/src/lib/datamodel.ts:269](https://github.com/oceanum-io/oceanum-js/blob/b819c1f297a41b7ce9644bbdd1734c693df7b2fd/packages/datamesh/src/lib/datamodel.ts#L269)

***

### attributes

> **attributes**: `Record`\<`string`, `unknown`\>

#### Defined in

[packages/datamesh/src/lib/datamodel.ts:268](https://github.com/oceanum-io/oceanum-js/blob/b819c1f297a41b7ce9644bbdd1734c693df7b2fd/packages/datamesh/src/lib/datamodel.ts#L268)

***

### dimensions

> **dimensions**: `string`[]

#### Defined in

[packages/datamesh/src/lib/datamodel.ts:267](https://github.com/oceanum-io/oceanum-js/blob/b819c1f297a41b7ce9644bbdd1734c693df7b2fd/packages/datamesh/src/lib/datamodel.ts#L267)

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

[packages/datamesh/src/lib/datamodel.ts:266](https://github.com/oceanum-io/oceanum-js/blob/b819c1f297a41b7ce9644bbdd1734c693df7b2fd/packages/datamesh/src/lib/datamodel.ts#L266)

## Methods

### get()

> **get**(`index`?): `Promise`\<[`Data`](../type-aliases/Data.md)\>

Retrieves the data from the zarr array. If the data is already cached, it returns the cached data.

#### Parameters

##### index?

Optional slice parameters to retrieve specific data from the zarr array.

`string`[] | `SliceDef`

#### Returns

`Promise`\<[`Data`](../type-aliases/Data.md)\>

A promise that resolves to the data of the zarr array.

#### Defined in

[packages/datamesh/src/lib/datamodel.ts:293](https://github.com/oceanum-io/oceanum-js/blob/b819c1f297a41b7ce9644bbdd1734c693df7b2fd/packages/datamesh/src/lib/datamodel.ts#L293)
