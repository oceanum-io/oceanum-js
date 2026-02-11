[**@oceanum/datamesh**](../../README.md)

***

[@oceanum/datamesh](../../README.md) / [index](../README.md) / ZarrOptions

# Interface: ZarrOptions

Defined in: [packages/datamesh/src/lib/datamodel.ts:540](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L540)

Represents a dataset with dimensions, data variables, and attributes.
Implements the DatasetApi interface.

## Properties

### chunks?

> `optional` **chunks**: `string`

Defined in: [packages/datamesh/src/lib/datamodel.ts:542](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L542)

***

### coordkeys?

> `optional` **coordkeys**: [`Coordkeys`](../type-aliases/Coordkeys.md)

Defined in: [packages/datamesh/src/lib/datamodel.ts:544](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L544)

***

### downsample?

> `optional` **downsample**: `Record`\<`string`, `number`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:543](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L543)

***

### group?

> `optional` **group**: `string`

Defined in: [packages/datamesh/src/lib/datamodel.ts:563](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L563)

Path to a specific group within the zarr hierarchy to open as a dataset.
If not specified, the root group is used.
Supports both Datamesh zarr groups and external zarr archives with nested groups.
Example: "/group1" or "group1"

***

### ~~nocache?~~

> `optional` **nocache**: `boolean`

Defined in: [packages/datamesh/src/lib/datamodel.ts:549](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L549)

#### Deprecated

Use `ttl: 0` instead to disable caching

***

### parameters?

> `optional` **parameters**: `Record`\<`string`, `string` \| `number`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:541](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L541)

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [packages/datamesh/src/lib/datamodel.ts:545](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L545)

***

### ttl?

> `optional` **ttl**: `number`

Defined in: [packages/datamesh/src/lib/datamodel.ts:556](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L556)

Time to live for cache entries in seconds.
- If undefined, cache never expires
- If 0, caching is disabled entirely
- If > 0, cache will be invalidated after this many seconds
