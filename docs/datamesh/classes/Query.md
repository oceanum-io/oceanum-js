[**@oceanum/datamesh**](../README.md)

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

##### query

[`IQuery`](../interfaces/IQuery.md)

#### Returns

[`Query`](Query.md)

#### Defined in

[packages/datamesh/src/lib/query.ts:178](https://github.com/oceanum-io/oceanum-js/blob/b819c1f297a41b7ce9644bbdd1734c693df7b2fd/packages/datamesh/src/lib/query.ts#L178)

## Properties

### aggregate?

> `optional` **aggregate**: [`Aggregate`](../type-aliases/Aggregate.md)

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`aggregate`](../interfaces/IQuery.md#aggregate)

#### Defined in

[packages/datamesh/src/lib/query.ts:174](https://github.com/oceanum-io/oceanum-js/blob/b819c1f297a41b7ce9644bbdd1734c693df7b2fd/packages/datamesh/src/lib/query.ts#L174)

***

### coordfilter?

> `optional` **coordfilter**: [`CoordSelector`](../type-aliases/CoordSelector.md)[]

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`coordfilter`](../interfaces/IQuery.md#coordfilter)

#### Defined in

[packages/datamesh/src/lib/query.ts:172](https://github.com/oceanum-io/oceanum-js/blob/b819c1f297a41b7ce9644bbdd1734c693df7b2fd/packages/datamesh/src/lib/query.ts#L172)

***

### crs?

> `optional` **crs**: `string` \| `number`

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`crs`](../interfaces/IQuery.md#crs)

#### Defined in

[packages/datamesh/src/lib/query.ts:173](https://github.com/oceanum-io/oceanum-js/blob/b819c1f297a41b7ce9644bbdd1734c693df7b2fd/packages/datamesh/src/lib/query.ts#L173)

***

### datasource

> **datasource**: `string`

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`datasource`](../interfaces/IQuery.md#datasource)

#### Defined in

[packages/datamesh/src/lib/query.ts:165](https://github.com/oceanum-io/oceanum-js/blob/b819c1f297a41b7ce9644bbdd1734c693df7b2fd/packages/datamesh/src/lib/query.ts#L165)

***

### description?

> `optional` **description**: `string`

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`description`](../interfaces/IQuery.md#description)

#### Defined in

[packages/datamesh/src/lib/query.ts:167](https://github.com/oceanum-io/oceanum-js/blob/b819c1f297a41b7ce9644bbdd1734c693df7b2fd/packages/datamesh/src/lib/query.ts#L167)

***

### geofilter?

> `optional` **geofilter**: [`GeoFilter`](../type-aliases/GeoFilter.md)

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`geofilter`](../interfaces/IQuery.md#geofilter)

#### Defined in

[packages/datamesh/src/lib/query.ts:170](https://github.com/oceanum-io/oceanum-js/blob/b819c1f297a41b7ce9644bbdd1734c693df7b2fd/packages/datamesh/src/lib/query.ts#L170)

***

### id?

> `optional` **id**: `string`

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`id`](../interfaces/IQuery.md#id)

#### Defined in

[packages/datamesh/src/lib/query.ts:176](https://github.com/oceanum-io/oceanum-js/blob/b819c1f297a41b7ce9644bbdd1734c693df7b2fd/packages/datamesh/src/lib/query.ts#L176)

***

### levelfilter?

> `optional` **levelfilter**: [`LevelFilter`](../type-aliases/LevelFilter.md)

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`levelfilter`](../interfaces/IQuery.md#levelfilter)

#### Defined in

[packages/datamesh/src/lib/query.ts:171](https://github.com/oceanum-io/oceanum-js/blob/b819c1f297a41b7ce9644bbdd1734c693df7b2fd/packages/datamesh/src/lib/query.ts#L171)

***

### limit?

> `optional` **limit**: `number`

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`limit`](../interfaces/IQuery.md#limit)

#### Defined in

[packages/datamesh/src/lib/query.ts:175](https://github.com/oceanum-io/oceanum-js/blob/b819c1f297a41b7ce9644bbdd1734c693df7b2fd/packages/datamesh/src/lib/query.ts#L175)

***

### parameters?

> `optional` **parameters**: `Record`\<`string`, `string` \| `number` \| `string`[] \| `number`[]\>

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`parameters`](../interfaces/IQuery.md#parameters)

#### Defined in

[packages/datamesh/src/lib/query.ts:166](https://github.com/oceanum-io/oceanum-js/blob/b819c1f297a41b7ce9644bbdd1734c693df7b2fd/packages/datamesh/src/lib/query.ts#L166)

***

### timefilter?

> `optional` **timefilter**: [`TimeFilter`](../type-aliases/TimeFilter.md)

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`timefilter`](../interfaces/IQuery.md#timefilter)

#### Defined in

[packages/datamesh/src/lib/query.ts:169](https://github.com/oceanum-io/oceanum-js/blob/b819c1f297a41b7ce9644bbdd1734c693df7b2fd/packages/datamesh/src/lib/query.ts#L169)

***

### variables?

> `optional` **variables**: `string`[]

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`variables`](../interfaces/IQuery.md#variables)

#### Defined in

[packages/datamesh/src/lib/query.ts:168](https://github.com/oceanum-io/oceanum-js/blob/b819c1f297a41b7ce9644bbdd1734c693df7b2fd/packages/datamesh/src/lib/query.ts#L168)

## Methods

### toJSON()

> **toJSON**(): `Record`\<`string`, `unknown`\>

Returns the query as a JSON object.

#### Returns

`Record`\<`string`, `unknown`\>

#### Defined in

[packages/datamesh/src/lib/query.ts:196](https://github.com/oceanum-io/oceanum-js/blob/b819c1f297a41b7ce9644bbdd1734c693df7b2fd/packages/datamesh/src/lib/query.ts#L196)
