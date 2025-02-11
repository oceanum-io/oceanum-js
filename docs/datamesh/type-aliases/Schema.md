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

[packages/datamesh/src/lib/datasource.ts:33](https://github.com/oceanum-io/oceanum-js/blob/8743de96e5f943db8ec0df1328a02f233bca002b/packages/datamesh/src/lib/datasource.ts#L33)
