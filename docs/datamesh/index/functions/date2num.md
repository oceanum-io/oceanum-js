[**@oceanum/datamesh**](../../README.md)

***

[@oceanum/datamesh](../../README.md) / [index](../README.md) / date2num

# Function: date2num()

## Call Signature

> **date2num**(`dates`, `units`, `calendar?`): `number`

Defined in: [packages/datamesh/src/lib/cftime.ts:285](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/cftime.ts#L285)

Convert JavaScript Date object(s) to numeric time value(s).

### Parameters

#### dates

`Date`

Date object or array of Date objects

#### units

`string`

CF time units string (e.g., "days since 1970-01-01")

#### calendar?

[`CFCalendar`](../type-aliases/CFCalendar.md)

Calendar type (default: "standard")

### Returns

`number`

Numeric time value or array of values

### Throws

Error if calendar is not supported

### Example

```ts
// Single value
const num = date2num(new Date("1970-01-02"), "days since 1970-01-01");
// 1

// Array of values
const nums = date2num([new Date("1970-01-01"), new Date("1970-01-02")], "days since 1970-01-01");
// [0, 1]
```

## Call Signature

> **date2num**(`dates`, `units`, `calendar?`): `number`[]

Defined in: [packages/datamesh/src/lib/cftime.ts:290](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/cftime.ts#L290)

Convert JavaScript Date object(s) to numeric time value(s).

### Parameters

#### dates

`Date`[]

Date object or array of Date objects

#### units

`string`

CF time units string (e.g., "days since 1970-01-01")

#### calendar?

[`CFCalendar`](../type-aliases/CFCalendar.md)

Calendar type (default: "standard")

### Returns

`number`[]

Numeric time value or array of values

### Throws

Error if calendar is not supported

### Example

```ts
// Single value
const num = date2num(new Date("1970-01-02"), "days since 1970-01-01");
// 1

// Array of values
const nums = date2num([new Date("1970-01-01"), new Date("1970-01-02")], "days since 1970-01-01");
// [0, 1]
```
