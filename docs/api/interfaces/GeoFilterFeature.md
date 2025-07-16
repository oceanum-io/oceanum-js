[**@oceanum/datamesh v0.4.1**](../README.md)

***

[@oceanum/datamesh](../README.md) / GeoFilterFeature

# Interface: GeoFilterFeature

Defined in: [packages/datamesh/src/lib/query.ts:47](https://github.com/oceanum-io/oceanum-js/blob/6ea95bc75340e32d4166044b1046d4453dd46745/packages/datamesh/src/lib/query.ts#L47)

## Extends

- `Omit`\<`Feature`, `"properties"`\>

## Properties

### bbox?

> `optional` **bbox**: `BBox`

Defined in: node\_modules/@types/geojson/index.d.ts:91

Bounding box of the coordinate range of the object's Geometries, Features, or Feature Collections.
The value of the bbox member is an array of length 2*n where n is the number of dimensions
represented in the contained geometries, with all axes of the most southwesterly point
followed by all axes of the more northeasterly point.
The axes order of a bbox follows the axes order of geometries.
https://tools.ietf.org/html/rfc7946#section-5

#### Inherited from

`Omit.bbox`

***

### geometry

> **geometry**: `Geometry`

Defined in: node\_modules/@types/geojson/index.d.ts:183

The feature's geometry

#### Inherited from

`Omit.geometry`

***

### id?

> `optional` **id**: `string` \| `number`

Defined in: node\_modules/@types/geojson/index.d.ts:188

A value that uniquely identifies this feature in a
https://tools.ietf.org/html/rfc7946#section-3.2.

#### Inherited from

`Omit.id`

***

### properties?

> `optional` **properties**: `Record`\<`string`, `unknown`\>

Defined in: [packages/datamesh/src/lib/query.ts:48](https://github.com/oceanum-io/oceanum-js/blob/6ea95bc75340e32d4166044b1046d4453dd46745/packages/datamesh/src/lib/query.ts#L48)

***

### type

> **type**: `"Feature"`

Defined in: node\_modules/@types/geojson/index.d.ts:179

Specifies the type of GeoJSON object.

#### Inherited from

`Omit.type`
