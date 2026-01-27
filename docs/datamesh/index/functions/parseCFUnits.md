[**@oceanum/datamesh**](../../README.md)

***

[@oceanum/datamesh](../../README.md) / [index](../README.md) / parseCFUnits

# Function: parseCFUnits()

> **parseCFUnits**(`units`): [`ParsedCFUnits`](../interfaces/ParsedCFUnits.md)

Defined in: [packages/datamesh/src/lib/cftime.ts:104](https://github.com/oceanum-io/oceanum-js/blob/3d9750577de57d3e495eb0e5df74fb0258cdb8b6/packages/datamesh/src/lib/cftime.ts#L104)

Parse a CF time units string.

## Parameters

### units

`string`

CF time units string (e.g., "days since 1970-01-01")

## Returns

[`ParsedCFUnits`](../interfaces/ParsedCFUnits.md)

Parsed units object

## Throws

Error if units string is invalid

## Example

```ts
const parsed = parseCFUnits("days since 1970-01-01");
// { unit: "days", referenceDate: Date, referenceMs: 0, original: "..." }

const parsed2 = parseCFUnits("hours since 2000-01-01 00:00:00");
// { unit: "hours", referenceDate: Date, referenceMs: 946684800000, original: "..." }
```
