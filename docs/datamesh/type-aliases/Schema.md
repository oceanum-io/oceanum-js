[**@oceanum/datamesh**](../README.md)

***

[@oceanum/datamesh](../README.md) / Schema

# Type Alias: Schema

> **Schema**: `object`

Represents the internal schema of a data source.

## Type declaration

### attributes?

> `optional` **attributes**: `Record`\<`string`, `string` \| `number`\>

Attributes of the schema.

### coordmap?

> `optional` **coordmap**: [`Coordmap`](Coordmap.md)

Coordinate map of the schema.

### dimensions

> **dimensions**: `Record`\<`string`, `number`\>

Dimensions of the schema.

### variables

> **variables**: `Record`\<`string`, [`DataVariable`](DataVariable.md)\>

Data variables of the schema.

## Defined in

[packages/datamesh/src/lib/datasource.ts:33](https://github.com/oceanum-io/oceanum-js/blob/b819c1f297a41b7ce9644bbdd1734c693df7b2fd/packages/datamesh/src/lib/datasource.ts#L33)
