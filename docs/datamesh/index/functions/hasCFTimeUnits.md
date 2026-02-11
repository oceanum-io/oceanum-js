[**@oceanum/datamesh**](../../README.md)

***

[@oceanum/datamesh](../../README.md) / [index](../README.md) / hasCFTimeUnits

# Function: hasCFTimeUnits()

> **hasCFTimeUnits**(`attrs`): `boolean`

Defined in: [packages/datamesh/src/lib/cftime.ts:350](https://github.com/oceanum-io/oceanum-js/blob/caaf80b4ce3f936efe18d2244930ed354860c5c1/packages/datamesh/src/lib/cftime.ts#L350)

Check if attributes indicate CF time units.
CF time units follow the pattern: "<unit> since <reference_time>"

## Parameters

### attrs

`Record`\<`string`, `unknown`\>

Variable attributes record

## Returns

`boolean`

true if the attributes contain valid CF time units
