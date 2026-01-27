[**@oceanum/datamesh**](../../README.md)

***

[@oceanum/datamesh](../../README.md) / [index](../README.md) / Query

# Class: Query

Defined in: [packages/datamesh/src/lib/query.ts:164](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/query.ts#L164)

Query class representing a Datamesh query.

## Implements

- [`IQuery`](../interfaces/IQuery.md)

## Constructors

### Constructor

> **new Query**(`query`): `Query`

Defined in: [packages/datamesh/src/lib/query.ts:178](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/query.ts#L178)

#### Parameters

##### query

[`IQuery`](../interfaces/IQuery.md)

#### Returns

`Query`

## Properties

### aggregate?

> `optional` **aggregate**: [`Aggregate`](../type-aliases/Aggregate.md)

Defined in: [packages/datamesh/src/lib/query.ts:174](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/query.ts#L174)

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`aggregate`](../interfaces/IQuery.md#aggregate)

***

### coordfilter?

> `optional` **coordfilter**: [`CoordSelector`](../type-aliases/CoordSelector.md)[]

Defined in: [packages/datamesh/src/lib/query.ts:172](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/query.ts#L172)

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`coordfilter`](../interfaces/IQuery.md#coordfilter)

***

### crs?

> `optional` **crs**: `string` \| `number`

Defined in: [packages/datamesh/src/lib/query.ts:173](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/query.ts#L173)

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`crs`](../interfaces/IQuery.md#crs)

***

### datasource

> **datasource**: `string`

Defined in: [packages/datamesh/src/lib/query.ts:165](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/query.ts#L165)

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`datasource`](../interfaces/IQuery.md#datasource)

***

### description?

> `optional` **description**: `string`

Defined in: [packages/datamesh/src/lib/query.ts:167](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/query.ts#L167)

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`description`](../interfaces/IQuery.md#description)

***

### geofilter?

> `optional` **geofilter**: [`GeoFilter`](../type-aliases/GeoFilter.md)

Defined in: [packages/datamesh/src/lib/query.ts:170](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/query.ts#L170)

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`geofilter`](../interfaces/IQuery.md#geofilter)

***

### id?

> `optional` **id**: `string`

Defined in: [packages/datamesh/src/lib/query.ts:176](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/query.ts#L176)

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`id`](../interfaces/IQuery.md#id)

***

### levelfilter?

> `optional` **levelfilter**: [`LevelFilter`](../type-aliases/LevelFilter.md)

Defined in: [packages/datamesh/src/lib/query.ts:171](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/query.ts#L171)

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`levelfilter`](../interfaces/IQuery.md#levelfilter)

***

### limit?

> `optional` **limit**: `number`

Defined in: [packages/datamesh/src/lib/query.ts:175](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/query.ts#L175)

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`limit`](../interfaces/IQuery.md#limit)

***

### parameters?

> `optional` **parameters**: `Record`\<`string`, `string` \| `number`\>

Defined in: [packages/datamesh/src/lib/query.ts:166](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/query.ts#L166)

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`parameters`](../interfaces/IQuery.md#parameters)

***

### timefilter?

> `optional` **timefilter**: [`TimeFilter`](../type-aliases/TimeFilter.md)

Defined in: [packages/datamesh/src/lib/query.ts:169](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/query.ts#L169)

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`timefilter`](../interfaces/IQuery.md#timefilter)

***

### variables?

> `optional` **variables**: `string`[]

Defined in: [packages/datamesh/src/lib/query.ts:168](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/query.ts#L168)

#### Implementation of

[`IQuery`](../interfaces/IQuery.md).[`variables`](../interfaces/IQuery.md#variables)

## Methods

### toJSON()

> **toJSON**(): `Record`\<`string`, `unknown`\>

Defined in: [packages/datamesh/src/lib/query.ts:196](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/query.ts#L196)

Returns the query as a JSON object.

#### Returns

`Record`\<`string`, `unknown`\>
