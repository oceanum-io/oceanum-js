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

[query.ts:100](https://github.com/oceanum-io/oceanum-js/blob/16e7839874a87c82d4c481b562840bf7ccac2d83/packages/datamesh/src/lib/query.ts#L100)
