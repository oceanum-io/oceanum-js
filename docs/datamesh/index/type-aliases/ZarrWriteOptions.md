[**@oceanum/datamesh**](../../README.md)

***

[@oceanum/datamesh](../../README.md) / [index](../README.md) / ZarrWriteOptions

# Type Alias: ZarrWriteOptions

> **ZarrWriteOptions** = `object`

Defined in: [packages/datamesh/src/lib/datamodel.ts:96](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L96)

Options for writing dataset to zarr format.

## Properties

### chunks?

> `optional` **chunks**: [`ChunkConfig`](ChunkConfig.md)

Defined in: [packages/datamesh/src/lib/datamodel.ts:100](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L100)

Chunk configuration for the output zarr.

***

### consolidated?

> `optional` **consolidated**: `boolean`

Defined in: [packages/datamesh/src/lib/datamodel.ts:104](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L104)

Whether to consolidate metadata (zarr v2 compatible).
