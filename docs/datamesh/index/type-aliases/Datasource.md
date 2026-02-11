[**@oceanum/datamesh**](../../README.md)

***

[@oceanum/datamesh](../../README.md) / [index](../README.md) / Datasource

# Type Alias: Datasource

> **Datasource** = `object`

Defined in: [packages/datamesh/src/lib/datasource.ts:84](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datasource.ts#L84)

Represents a data source.

## Properties

### coordinates

> **coordinates**: [`Coordkeys`](Coordkeys.md)

Defined in: [packages/datamesh/src/lib/datasource.ts:148](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datasource.ts#L148)

Coordinate map for the data source.

***

### description?

> `optional` **description**: `string`

Defined in: [packages/datamesh/src/lib/datasource.ts:98](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datasource.ts#L98)

Description of the data source.

***

### details?

> `optional` **details**: `string`

Defined in: [packages/datamesh/src/lib/datasource.ts:153](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datasource.ts#L153)

Additional details about the data source.

***

### driver

> **driver**: `string`

Defined in: [packages/datamesh/src/lib/datasource.ts:160](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datasource.ts#L160)

***

### geom?

> `optional` **geom**: `Geometry`

Defined in: [packages/datamesh/src/lib/datasource.ts:108](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datasource.ts#L108)

Geometric representation of the data source.

***

### id

> **id**: `string`

Defined in: [packages/datamesh/src/lib/datasource.ts:88](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datasource.ts#L88)

Unique identifier for the data source.

***

### info?

> `optional` **info**: `Record`\<`string`, `unknown`\>

Defined in: [packages/datamesh/src/lib/datasource.ts:138](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datasource.ts#L138)

Additional information about the data source.

***

### last\_modified?

> `optional` **last\_modified**: `Date`

Defined in: [packages/datamesh/src/lib/datasource.ts:158](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datasource.ts#L158)

Last modified date of the data source.

***

### name

> **name**: `string`

Defined in: [packages/datamesh/src/lib/datasource.ts:93](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datasource.ts#L93)

Name of the data source.

***

### parameters?

> `optional` **parameters**: `Record`\<`string`, `string` \| `number`\>

Defined in: [packages/datamesh/src/lib/datasource.ts:103](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datasource.ts#L103)

Parameters associated with the data source.

***

### parchive?

> `optional` **parchive**: `duration.Duration`

Defined in: [packages/datamesh/src/lib/datasource.ts:128](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datasource.ts#L128)

Archive time period for the data source.

***

### pforecast?

> `optional` **pforecast**: `duration.Duration`

Defined in: [packages/datamesh/src/lib/datasource.ts:123](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datasource.ts#L123)

Forecast time period for the data source.

***

### schema

> **schema**: [`DatameshSchema`](DatameshSchema.md)

Defined in: [packages/datamesh/src/lib/datasource.ts:143](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datasource.ts#L143)

Schema information for the data source.

***

### tags?

> `optional` **tags**: `string`[]

Defined in: [packages/datamesh/src/lib/datasource.ts:133](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datasource.ts#L133)

Tags associated with the data source.

***

### tend?

> `optional` **tend**: `dayjs.Dayjs`

Defined in: [packages/datamesh/src/lib/datasource.ts:118](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datasource.ts#L118)

End time for the data source.

***

### tstart?

> `optional` **tstart**: `dayjs.Dayjs`

Defined in: [packages/datamesh/src/lib/datasource.ts:113](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/datamesh/src/lib/datasource.ts#L113)

Start time for the data source.
