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

[datasource.ts:37](https://github.com/oceanum-io/oceanum-js/blob/9d9da5e1fe7bfe3eb08f728ecb75a0de98f61034/packages/datamesh/src/lib/datasource.ts#L37)
