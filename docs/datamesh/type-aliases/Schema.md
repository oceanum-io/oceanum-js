[**@oceanum/datamesh**](../README.md) • **Docs**

***

[@oceanum/datamesh](../README.md) / Schema

# Type Alias: Schema

> **Schema**: `object`

Represents the schema of a data source.

## Type declaration

### attrs?

> `optional` **attrs**: `Record`\<`string`, `string` \| `number`\>

Attributes of the schema.

### coords?

> `optional` **coords**: `Record`\<`string`, [`DataVariable`](DataVariable.md)\>

Coordinates of the schema.

### data\_vars

> **data\_vars**: `Record`\<`string`, [`DataVariable`](DataVariable.md)\>

Data variables of the schema.

### dims

> **dims**: `Record`\<`string`, `number`\>

Dimensions of the schema.

## Defined in

[datasource.ts:34](https://github.com/oceanum-io/oceanum-js/blob/2a3d0b3c7de398029b2a7ac8bdc8bdd7f540f7d6/packages/datamesh/src/lib/datasource.ts#L34)
