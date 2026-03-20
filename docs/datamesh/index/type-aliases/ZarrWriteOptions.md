[**@oceanum/datamesh**](../../README.md)

***

[@oceanum/datamesh](../../README.md) / [index](../README.md) / ZarrWriteOptions

# Type Alias: ZarrWriteOptions

> **ZarrWriteOptions** = `object`

Defined in: [packages/datamesh/src/lib/datamodel.ts:96](https://github.com/oceanum-io/oceanum-js/blob/1e30cac74553cb0c9c53b02b8ca8f899f43b209f/packages/datamesh/src/lib/datamodel.ts#L96)

Options for writing dataset to zarr format.

## Properties

### chunks?

> `optional` **chunks**: [`ChunkConfig`](ChunkConfig.md)

Defined in: [packages/datamesh/src/lib/datamodel.ts:100](https://github.com/oceanum-io/oceanum-js/blob/1e30cac74553cb0c9c53b02b8ca8f899f43b209f/packages/datamesh/src/lib/datamodel.ts#L100)

Chunk configuration for the output zarr.

***

### consolidated?

> `optional` **consolidated**: `boolean`

Defined in: [packages/datamesh/src/lib/datamodel.ts:104](https://github.com/oceanum-io/oceanum-js/blob/1e30cac74553cb0c9c53b02b8ca8f899f43b209f/packages/datamesh/src/lib/datamodel.ts#L104)

Whether to consolidate metadata (zarr v2 compatible).
