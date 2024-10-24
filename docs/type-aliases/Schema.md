[**@oceanum/datamesh**](../README.md) • **Docs**

***

[@oceanum/datamesh](../packages.md) / Schema

# Type Alias: Schema

> **Schema**: `object`

Represents the schema of a data source.

## Type declaration

### attrs?

> `optional` **attrs**: `Record`\<`string`, `string` \| `number`\>

Attributes of the schema.

### coords?

> `optional` **coords**: `Record`\<`string`, `DataVariable`\>

Coordinates of the schema.

### data\_vars

> **data\_vars**: `Record`\<`string`, `DataVariable`\>

Data variables of the schema.

### dims

> **dims**: `Record`\<`string`, `number`\>

Dimensions of the schema.

## Defined in

[datasource.ts:37](https://github.com/oceanum-io/oceanum-js/blob/9448ff9235fa530de87f8083974fe4591062d735/packages/datamesh/src/lib/datasource.ts#L37)
