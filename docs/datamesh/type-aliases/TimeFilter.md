[**@oceanum/datamesh**](../README.md)

***

[@oceanum/datamesh](../README.md) / TimeFilter

# Type Alias: TimeFilter

> **TimeFilter**: `object`

Defined in: [packages/datamesh/src/lib/query.ts:74](https://github.com/oceanum-io/oceanum-js/blob/4449d4b3fac355094039d4392e96edf8345b7153/packages/datamesh/src/lib/query.ts#L74)

TimeFilter type representing a temporal subset or interpolation.

## Type declaration

### resample?

> `optional` **resample**: [`ResampleType`](ResampleType.md)

### resolution?

> `optional` **resolution**: `string`

### times

> **times**: (`Date` \| `dayjs.Dayjs` \| `duration.Duration` \| `string`)[]

### type?

> `optional` **type**: [`TimeFilterType`](TimeFilterType.md)
