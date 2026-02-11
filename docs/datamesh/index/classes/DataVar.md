[**@oceanum/datamesh**](../../README.md)

***

[@oceanum/datamesh](../../README.md) / [index](../README.md) / DataVar

# Class: DataVar\<S\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:441](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L441)

Represents a data variable within a dataset.

## Type Parameters

### S

`S` *extends* `TempZarr` \| `HttpZarr`

## Constructors

### Constructor

> **new DataVar**\<`S`\>(`id`, `dimensions`, `attributes`, `arr`): `DataVar`\<`DType`, `S`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:459](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L459)

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

Defined in: [packages/datamesh/src/lib/datamodel.ts:456](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L456)

***

### attributes

> **attributes**: `Record`\<`string`, `unknown`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:455](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L455)

***

### dimensions

> **dimensions**: `string`[]

Defined in: [packages/datamesh/src/lib/datamodel.ts:454](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L454)

***

### id

> **id**: `string`

Defined in: [packages/datamesh/src/lib/datamodel.ts:453](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L453)

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

Defined in: [packages/datamesh/src/lib/datamodel.ts:480](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L480)

Retrieves the data from the zarr array. If the data is already cached, it returns the cached data.

#### Parameters

##### index?

Optional slice parameters to retrieve specific data from the zarr array.

`string`[] | (`number` \| `Slice`)[]

#### Returns

`Promise`\<[`Data`](../type-aliases/Data.md)\>

A promise that resolves to the data of the zarr array.
