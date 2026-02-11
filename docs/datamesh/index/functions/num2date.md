[**@oceanum/datamesh**](../../README.md)

***

[@oceanum/datamesh](../../README.md) / [index](../README.md) / num2date

# Function: num2date()

## Call Signature

> **num2date**(`times`, `units`, `calendar?`): `Date`

Defined in: [packages/datamesh/src/lib/cftime.ts:216](https://github.com/oceanum-io/oceanum-js/blob/caaf80b4ce3f936efe18d2244930ed354860c5c1/packages/datamesh/src/lib/cftime.ts#L216)

Convert numeric time value(s) to JavaScript Date object(s).

### Parameters

#### times

`number`

Numeric time value or array of values

#### units

`string`

CF time units string (e.g., "days since 1970-01-01")

#### calendar?

[`CFCalendar`](../type-aliases/CFCalendar.md)

Calendar type (default: "standard")

### Returns

`Date`

Date object or array of Date objects

### Throws

Error if calendar is not supported

### Example

```ts
// Single value
const date = num2date(0, "days since 1970-01-01");
// Date: 1970-01-01T00:00:00.000Z

// Array of values
const dates = num2date([0, 1, 2], "days since 1970-01-01");
// [Date: 1970-01-01, Date: 1970-01-02, Date: 1970-01-03]

// Hours since reference
const date2 = num2date(24, "hours since 2000-01-01");
// Date: 2000-01-02T00:00:00.000Z
```

## Call Signature

> **num2date**(`times`, `units`, `calendar?`): `Date`[]

Defined in: [packages/datamesh/src/lib/cftime.ts:221](https://github.com/oceanum-io/oceanum-js/blob/caaf80b4ce3f936efe18d2244930ed354860c5c1/packages/datamesh/src/lib/cftime.ts#L221)

Convert numeric time value(s) to JavaScript Date object(s).

### Parameters

#### times

`number`[]

Numeric time value or array of values

#### units

`string`

CF time units string (e.g., "days since 1970-01-01")

#### calendar?

[`CFCalendar`](../type-aliases/CFCalendar.md)

Calendar type (default: "standard")

### Returns

`Date`[]

Date object or array of Date objects

### Throws

Error if calendar is not supported

### Example

```ts
// Single value
const date = num2date(0, "days since 1970-01-01");
// Date: 1970-01-01T00:00:00.000Z

// Array of values
const dates = num2date([0, 1, 2], "days since 1970-01-01");
// [Date: 1970-01-01, Date: 1970-01-02, Date: 1970-01-03]

// Hours since reference
const date2 = num2date(24, "hours since 2000-01-01");
// Date: 2000-01-02T00:00:00.000Z
```

## Call Signature

> **num2date**(`times`, `units`, `calendar?`): `Date`[]

Defined in: [packages/datamesh/src/lib/cftime.ts:226](https://github.com/oceanum-io/oceanum-js/blob/caaf80b4ce3f936efe18d2244930ed354860c5c1/packages/datamesh/src/lib/cftime.ts#L226)

Convert numeric time value(s) to JavaScript Date object(s).

### Parameters

#### times

Numeric time value or array of values

`Float64Array`\<`ArrayBufferLike`\> | `Float32Array`\<`ArrayBufferLike`\> | `Int32Array`\<`ArrayBufferLike`\>

#### units

`string`

CF time units string (e.g., "days since 1970-01-01")

#### calendar?

[`CFCalendar`](../type-aliases/CFCalendar.md)

Calendar type (default: "standard")

### Returns

`Date`[]

Date object or array of Date objects

### Throws

Error if calendar is not supported

### Example

```ts
// Single value
const date = num2date(0, "days since 1970-01-01");
// Date: 1970-01-01T00:00:00.000Z

// Array of values
const dates = num2date([0, 1, 2], "days since 1970-01-01");
// [Date: 1970-01-01, Date: 1970-01-02, Date: 1970-01-03]

// Hours since reference
const date2 = num2date(24, "hours since 2000-01-01");
// Date: 2000-01-02T00:00:00.000Z
```
