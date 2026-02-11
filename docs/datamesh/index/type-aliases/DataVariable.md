[**@oceanum/datamesh**](../../README.md)

***

[@oceanum/datamesh](../../README.md) / [index](../README.md) / DataVariable

# Type Alias: DataVariable

> **DataVariable** = `object`

Defined in: [packages/datamesh/src/lib/datamodel.ts:53](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L53)

Represents a data variable.

## Properties

### attributes

> **attributes**: `Record`\<`string`, `string` \| `unknown`\>

Defined in: [packages/datamesh/src/lib/datamodel.ts:57](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L57)

Attributes of the variable.

***

### chunks?

> `optional` **chunks**: `number`[]

Defined in: [packages/datamesh/src/lib/datamodel.ts:74](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L74)

Chunk sizes for the variable dimensions.
If not specified, uses the global chunk configuration or defaults to the full shape.

***

### data?

> `optional` **data**: [`Data`](Data.md)

Defined in: [packages/datamesh/src/lib/datamodel.ts:69](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L69)

Data associated with the variable.

***

### dimensions

> **dimensions**: `string`[]

Defined in: [packages/datamesh/src/lib/datamodel.ts:61](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L61)

Dimensions of the variable

***

### dtype?

> `optional` **dtype**: `DataType`

Defined in: [packages/datamesh/src/lib/datamodel.ts:65](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datamodel.ts#L65)

Datatype of the variable.
