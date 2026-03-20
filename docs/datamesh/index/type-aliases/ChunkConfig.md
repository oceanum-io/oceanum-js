[**@oceanum/datamesh**](../../index.md)

***

[@oceanum/datamesh](../../index.md) / [index](../index.md) / ChunkConfig

# Type Alias: ChunkConfig

> **ChunkConfig** = `object`

Defined in: [packages/datamesh/src/lib/datamodel.ts:80](https://github.com/oceanum-io/oceanum-js/blob/1e30cac74553cb0c9c53b02b8ca8f899f43b209f/packages/datamesh/src/lib/datamodel.ts#L80)

Configuration for chunking when writing zarr data.

## Properties

### dimensions?

> `optional` **dimensions**: `Record`\<`string`, `number`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:85](https://github.com/oceanum-io/oceanum-js/blob/1e30cac74553cb0c9c53b02b8ca8f899f43b209f/packages/datamesh/src/lib/datamodel.ts#L85)

Global chunk sizes by dimension name.
These apply to all variables unless overridden per-variable.

***

### variables?

> `optional` **variables**: `Record`\<`string`, `number`[]\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:90](https://github.com/oceanum-io/oceanum-js/blob/1e30cac74553cb0c9c53b02b8ca8f899f43b209f/packages/datamesh/src/lib/datamodel.ts#L90)

Per-variable chunk size overrides.
Keys are variable names, values are arrays of chunk sizes matching the variable dimensions.
