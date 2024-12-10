[**@oceanum/datamesh**](../README.md) • **Docs**

***

[@oceanum/datamesh](../README.md) / Query

# Class: Query

Query class representing a Datamesh query.

## Implements

- [`IQuery`](../interfaces/IQuery.md)

## Constructors

### new Query()

> **new Query**(`query`): [`Query`](Query.md)

#### Parameters

• **query**: [`IQuery`](../interfaces/IQuery.md)

#### Returns

[`Query`](Query.md)

#### Defined in

[query.ts:203](https://github.com/oceanum-io/oceanum-js/blob/2a3d0b3c7de398029b2a7ac8bdc8bdd7f540f7d6/packages/datamesh/src/lib/query.ts#L203)

## Properties

### aggregate?

> `optional` **aggregate**: [`Aggregate`](../type-aliases/Aggregate.md)

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`aggregate`](../interfaces/IQuery.md#aggregate)

#### Defined in

[query.ts:199](https://github.com/oceanum-io/oceanum-js/blob/2a3d0b3c7de398029b2a7ac8bdc8bdd7f540f7d6/packages/datamesh/src/lib/query.ts#L199)

***

### coordfilter?

> `optional` **coordfilter**: [`CoordSelector`](../type-aliases/CoordSelector.md)[]

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`coordfilter`](../interfaces/IQuery.md#coordfilter)

#### Defined in

[query.ts:197](https://github.com/oceanum-io/oceanum-js/blob/2a3d0b3c7de398029b2a7ac8bdc8bdd7f540f7d6/packages/datamesh/src/lib/query.ts#L197)

***

### crs?

> `optional` **crs**: `string` \| `number`

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`crs`](../interfaces/IQuery.md#crs)

#### Defined in

[query.ts:198](https://github.com/oceanum-io/oceanum-js/blob/2a3d0b3c7de398029b2a7ac8bdc8bdd7f540f7d6/packages/datamesh/src/lib/query.ts#L198)

***

### datasource

> **datasource**: `string`

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`datasource`](../interfaces/IQuery.md#datasource)

#### Defined in

[query.ts:190](https://github.com/oceanum-io/oceanum-js/blob/2a3d0b3c7de398029b2a7ac8bdc8bdd7f540f7d6/packages/datamesh/src/lib/query.ts#L190)

***

### description?

> `optional` **description**: `string`

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`description`](../interfaces/IQuery.md#description)

#### Defined in

[query.ts:192](https://github.com/oceanum-io/oceanum-js/blob/2a3d0b3c7de398029b2a7ac8bdc8bdd7f540f7d6/packages/datamesh/src/lib/query.ts#L192)

***

### geofilter?

> `optional` **geofilter**: [`GeoFilter`](../type-aliases/GeoFilter.md)

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`geofilter`](../interfaces/IQuery.md#geofilter)

#### Defined in

[query.ts:195](https://github.com/oceanum-io/oceanum-js/blob/2a3d0b3c7de398029b2a7ac8bdc8bdd7f540f7d6/packages/datamesh/src/lib/query.ts#L195)

***

### id?

> `optional` **id**: `string`

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`id`](../interfaces/IQuery.md#id)

#### Defined in

[query.ts:201](https://github.com/oceanum-io/oceanum-js/blob/2a3d0b3c7de398029b2a7ac8bdc8bdd7f540f7d6/packages/datamesh/src/lib/query.ts#L201)

***

### levelfilter?

> `optional` **levelfilter**: [`LevelFilter`](../type-aliases/LevelFilter.md)

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`levelfilter`](../interfaces/IQuery.md#levelfilter)

#### Defined in

[query.ts:196](https://github.com/oceanum-io/oceanum-js/blob/2a3d0b3c7de398029b2a7ac8bdc8bdd7f540f7d6/packages/datamesh/src/lib/query.ts#L196)

***

### limit?

> `optional` **limit**: `number`

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`limit`](../interfaces/IQuery.md#limit)

#### Defined in

[query.ts:200](https://github.com/oceanum-io/oceanum-js/blob/2a3d0b3c7de398029b2a7ac8bdc8bdd7f540f7d6/packages/datamesh/src/lib/query.ts#L200)

***

### parameters?

> `optional` **parameters**: `Record`\<`string`, `string` \| `number` \| `string`[] \| `number`[]\>

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`parameters`](../interfaces/IQuery.md#parameters)

#### Defined in

[query.ts:191](https://github.com/oceanum-io/oceanum-js/blob/2a3d0b3c7de398029b2a7ac8bdc8bdd7f540f7d6/packages/datamesh/src/lib/query.ts#L191)

***

### timefilter?

> `optional` **timefilter**: [`TimeFilter`](../type-aliases/TimeFilter.md)

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`timefilter`](../interfaces/IQuery.md#timefilter)

#### Defined in

[query.ts:194](https://github.com/oceanum-io/oceanum-js/blob/2a3d0b3c7de398029b2a7ac8bdc8bdd7f540f7d6/packages/datamesh/src/lib/query.ts#L194)

***

### variables?

> `optional` **variables**: `string`[]

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`variables`](../interfaces/IQuery.md#variables)

#### Defined in

[query.ts:193](https://github.com/oceanum-io/oceanum-js/blob/2a3d0b3c7de398029b2a7ac8bdc8bdd7f540f7d6/packages/datamesh/src/lib/query.ts#L193)

## Methods

### toJSON()

> **toJSON**(): `Record`\<`string`, `unknown`\>

Returns the query as a JSON object.

#### Returns

`Record`\<`string`, `unknown`\>

#### Defined in

[query.ts:221](https://github.com/oceanum-io/oceanum-js/blob/2a3d0b3c7de398029b2a7ac8bdc8bdd7f540f7d6/packages/datamesh/src/lib/query.ts#L221)
