[**@oceanum/datamesh**](../README.md) • **Docs**

***

[@oceanum/datamesh](../packages.md) / Datasource

# Type Alias: Datasource

> **Datasource**: `object`

Represents a data source.

## Type declaration

### coordinates

> **coordinates**: `Coordinates`

Coordinate mappings for the data source.

### description?

> `optional` **description**: `string`

Description of the data source.

### details?

> `optional` **details**: `string`

Additional details about the data source.

### driver

> **driver**: `string`

### geom?

> `optional` **geom**: `Geometry`

Geometric representation of the data source.

### id

> **id**: `string`

Unique identifier for the data source.

### info?

> `optional` **info**: `Record`\<`string`, `unknown`\>

Additional information about the data source.

### last\_modified?

> `optional` **last\_modified**: `Date`

Last modified date of the data source.

### name

> **name**: `string`

Name of the data source.

### parameters?

> `optional` **parameters**: `Record`\<`string`, `unknown`\>

Parameters associated with the data source.

### parchive?

> `optional` **parchive**: `duration.Duration`

Archive time period for the data source.

### pforecast?

> `optional` **pforecast**: `duration.Duration`

Forecast time period for the data source.

### schema

> **schema**: [`Schema`](Schema.md)

Schema information for the data source.

### tags?

> `optional` **tags**: `string`[]

Tags associated with the data source.

### tend?

> `optional` **tend**: `dayjs.Dayjs`

End time for the data source.

### tstart?

> `optional` **tstart**: `dayjs.Dayjs`

Start time for the data source.

## Defined in

[datasource.ts:62](https://github.com/oceanum-io/oceanum-js/blob/9d9da5e1fe7bfe3eb08f728ecb75a0de98f61034/packages/datamesh/src/lib/datasource.ts#L62)
