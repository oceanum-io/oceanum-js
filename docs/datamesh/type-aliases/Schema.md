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

[datasource.ts:34](https://github.com/oceanum-io/oceanum-js/blob/16e7839874a87c82d4c481b562840bf7ccac2d83/packages/datamesh/src/lib/datasource.ts#L34)
