[**@oceanum/datamesh**](../../index.md)

***

[@oceanum/datamesh](../../index.md) / [index](../index.md) / hasCFTimeUnits

# Function: hasCFTimeUnits()

> **hasCFTimeUnits**(`attrs`): `boolean`

Defined in: [packages/datamesh/src/lib/cftime.ts:350](https://github.com/oceanum-io/oceanum-js/blob/1e30cac74553cb0c9c53b02b8ca8f899f43b209f/packages/datamesh/src/lib/cftime.ts#L350)

Check if attributes indicate CF time units.
CF time units follow the pattern: "<unit> since <reference_time>"

## Parameters

### attrs

`Record`\<`string`, `unknown`\>

Variable attributes record

## Returns

`boolean`

true if the attributes contain valid CF time units
