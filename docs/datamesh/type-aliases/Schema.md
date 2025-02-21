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

### coordkeys?

> `optional` **coordkeys**: [`Coordkeys`](Coordkeys.md)

Coordinate map of the schema.

### dimensions

> **dimensions**: `Record`\<`string`, `number`\>

Dimensions of the schema.

### variables

> **variables**: `Record`\<`string`, [`DataVariable`](DataVariable.md)\>

Data variables of the schema.

## Defined in

[packages/datamesh/src/lib/datasource.ts:33](https://github.com/oceanum-io/oceanum-js/blob/434a76394a76820b6be1b553be9d6f05bb5ccb16/packages/datamesh/src/lib/datasource.ts#L33)
