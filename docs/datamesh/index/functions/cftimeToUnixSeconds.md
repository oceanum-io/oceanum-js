[**@oceanum/datamesh**](../../index.md)

***

[@oceanum/datamesh](../../index.md) / [index](../index.md) / cftimeToUnixSeconds

# Function: cftimeToUnixSeconds()

> **cftimeToUnixSeconds**(`data`, `units`, `calendar?`): `Float64Array`\<`ArrayBufferLike`\>

Defined in: [packages/datamesh/src/lib/cftime.ts:364](https://github.com/oceanum-io/oceanum-js/blob/1e30cac74553cb0c9c53b02b8ca8f899f43b209f/packages/datamesh/src/lib/cftime.ts#L364)

Convert CF time values to Unix timestamp (seconds since 1970-01-01).
Used for lazy conversion when accessing zarr data with CF time units.

## Parameters

### data

`ArrayLike`\<`number` \| `bigint`\>

Array of numeric time values

### units

`string`

CF time units string (e.g., "days since 1970-01-01")

### calendar?

`string` = `"standard"`

CF calendar type (defaults to "standard")

## Returns

`Float64Array`\<`ArrayBufferLike`\>

Float64Array of Unix timestamps in seconds, or null if calendar unsupported
