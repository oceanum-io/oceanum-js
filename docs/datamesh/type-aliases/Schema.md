[**@oceanum/datamesh**](../README.md)

***

[@oceanum/datamesh](../README.md) / Schema

# Type Alias: Schema

> **Schema**: `object`

Defined in: [packages/datamesh/src/lib/datasource.ts:33](https://github.com/oceanum-io/oceanum-js/blob/4449d4b3fac355094039d4392e96edf8345b7153/packages/datamesh/src/lib/datasource.ts#L33)

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
