[**@oceanum/datamesh**](../README.md) • **Docs**

***

[@oceanum/datamesh](../README.md) / TimeFilter

# Type Alias: TimeFilter

> **TimeFilter**: `object`

TimeFilter type representing a temporal subset or interpolation.

## Type declaration

### resample?

> `optional` **resample**: [`ResampleType`](../enumerations/ResampleType.md)

### resolution?

> `optional` **resolution**: `string`

### times

> **times**: (`Date` \| `dayjs.Dayjs` \| `duration.Duration` \| `string`)[]

### type?

> `optional` **type**: [`TimeFilterType`](../enumerations/TimeFilterType.md)

## Defined in

[query.ts:100](https://github.com/oceanum-io/oceanum-js/blob/2a3d0b3c7de398029b2a7ac8bdc8bdd7f540f7d6/packages/datamesh/src/lib/query.ts#L100)
