[**@oceanum/datamesh**](../../README.md)

***

[@oceanum/datamesh](../../README.md) / [index](../README.md) / ZarrWriteOptions

# Type Alias: ZarrWriteOptions

> **ZarrWriteOptions** = `object`

Defined in: [packages/datamesh/src/lib/datamodel.ts:92](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/datamodel.ts#L92)

Options for writing dataset to zarr format.

## Properties

### chunks?

> `optional` **chunks**: [`ChunkConfig`](ChunkConfig.md)

Defined in: [packages/datamesh/src/lib/datamodel.ts:96](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/datamodel.ts#L96)

Chunk configuration for the output zarr.

***

### consolidated?

> `optional` **consolidated**: `boolean`

Defined in: [packages/datamesh/src/lib/datamodel.ts:100](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/datamodel.ts#L100)

Whether to consolidate metadata (zarr v2 compatible).
