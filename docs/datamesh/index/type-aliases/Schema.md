[**@oceanum/datamesh**](../../README.md)

***

[@oceanum/datamesh](../../README.md) / [index](../README.md) / Schema

# Type Alias: Schema

> **Schema** = `object`

Defined in: [packages/datamesh/src/lib/datasource.ts:33](https://github.com/oceanum-io/oceanum-js/blob/caaf80b4ce3f936efe18d2244930ed354860c5c1/packages/datamesh/src/lib/datasource.ts#L33)

Represents the internal schema of a data source.

## Properties

### attributes?

> `optional` **attributes**: `Record`\<`string`, `string` \| `number`\>

Defined in: [packages/datamesh/src/lib/datasource.ts:37](https://github.com/oceanum-io/oceanum-js/blob/caaf80b4ce3f936efe18d2244930ed354860c5c1/packages/datamesh/src/lib/datasource.ts#L37)

Attributes of the schema.

***

### coordkeys?

> `optional` **coordkeys**: [`Coordkeys`](Coordkeys.md)

Defined in: [packages/datamesh/src/lib/datasource.ts:47](https://github.com/oceanum-io/oceanum-js/blob/caaf80b4ce3f936efe18d2244930ed354860c5c1/packages/datamesh/src/lib/datasource.ts#L47)

Coordinate map of the schema.

***

### dimensions

> **dimensions**: `Record`\<`string`, `number`\>

Defined in: [packages/datamesh/src/lib/datasource.ts:42](https://github.com/oceanum-io/oceanum-js/blob/caaf80b4ce3f936efe18d2244930ed354860c5c1/packages/datamesh/src/lib/datasource.ts#L42)

Dimensions of the schema.

***

### variables

> **variables**: `Record`\<`string`, [`DataVariable`](DataVariable.md)\>

Defined in: [packages/datamesh/src/lib/datasource.ts:52](https://github.com/oceanum-io/oceanum-js/blob/caaf80b4ce3f936efe18d2244930ed354860c5c1/packages/datamesh/src/lib/datasource.ts#L52)

Data variables of the schema.
