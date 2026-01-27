[**@oceanum/datamesh**](../../README.md)

***

[@oceanum/datamesh](../../README.md) / [index](../README.md) / ChunkConfig

# Type Alias: ChunkConfig

> **ChunkConfig** = `object`

Defined in: [packages/datamesh/src/lib/datamodel.ts:76](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/datamodel.ts#L76)

Configuration for chunking when writing zarr data.

## Properties

### dimensions?

> `optional` **dimensions**: `Record`\<`string`, `number`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:81](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/datamodel.ts#L81)

Global chunk sizes by dimension name.
These apply to all variables unless overridden per-variable.

***

### variables?

> `optional` **variables**: `Record`\<`string`, `number`[]\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:86](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/datamodel.ts#L86)

Per-variable chunk size overrides.
Keys are variable names, values are arrays of chunk sizes matching the variable dimensions.
