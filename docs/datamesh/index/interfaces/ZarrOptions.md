[**@oceanum/datamesh**](../../README.md)

***

[@oceanum/datamesh](../../README.md) / [index](../README.md) / ZarrOptions

# Interface: ZarrOptions

Defined in: [packages/datamesh/src/lib/datamodel.ts:536](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/datamodel.ts#L536)

Represents a dataset with dimensions, data variables, and attributes.
Implements the DatasetApi interface.

## Properties

### chunks?

> `optional` **chunks**: `string`

Defined in: [packages/datamesh/src/lib/datamodel.ts:538](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/datamodel.ts#L538)

***

### coordkeys?

> `optional` **coordkeys**: [`Coordkeys`](../type-aliases/Coordkeys.md)

Defined in: [packages/datamesh/src/lib/datamodel.ts:540](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/datamodel.ts#L540)

***

### downsample?

> `optional` **downsample**: `Record`\<`string`, `number`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:539](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/datamodel.ts#L539)

***

### ~~nocache?~~

> `optional` **nocache**: `boolean`

Defined in: [packages/datamesh/src/lib/datamodel.ts:545](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/datamodel.ts#L545)

#### Deprecated

Use `ttl: 0` instead to disable caching

***

### parameters?

> `optional` **parameters**: `Record`\<`string`, `string` \| `number`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:537](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/datamodel.ts#L537)

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [packages/datamesh/src/lib/datamodel.ts:541](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/datamodel.ts#L541)

***

### ttl?

> `optional` **ttl**: `number`

Defined in: [packages/datamesh/src/lib/datamodel.ts:552](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/datamodel.ts#L552)

Time to live for cache entries in seconds.
- If undefined, cache never expires
- If 0, caching is disabled entirely
- If > 0, cache will be invalidated after this many seconds
