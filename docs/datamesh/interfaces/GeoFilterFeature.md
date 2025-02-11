[**@oceanum/datamesh**](../README.md)

***

[@oceanum/datamesh](../README.md) / GeoFilterFeature

# Interface: GeoFilterFeature

## Extends

- `Omit`\<`Feature`, `"properties"`\>

## Properties

### bbox?

> `optional` **bbox**: `BBox`

Bounding box of the coordinate range of the object's Geometries, Features, or Feature Collections.
The value of the bbox member is an array of length 2*n where n is the number of dimensions
represented in the contained geometries, with all axes of the most southwesterly point
followed by all axes of the more northeasterly point.
The axes order of a bbox follows the axes order of geometries.
https://tools.ietf.org/html/rfc7946#section-5

#### Inherited from

`Omit.bbox`

#### Defined in

node\_modules/@types/geojson/index.d.ts:57

***

### geometry

> **geometry**: `Geometry`

The feature's geometry

#### Inherited from

`Omit.geometry`

#### Defined in

node\_modules/@types/geojson/index.d.ts:149

***

### id?

> `optional` **id**: `string` \| `number`

A value that uniquely identifies this feature in a
https://tools.ietf.org/html/rfc7946#section-3.2.

#### Inherited from

`Omit.id`

#### Defined in

node\_modules/@types/geojson/index.d.ts:154

***

### properties?

> `optional` **properties**: `Record`\<`string`, `unknown`\>

#### Defined in

[packages/datamesh/src/lib/query.ts:48](https://github.com/oceanum-io/oceanum-js/blob/8743de96e5f943db8ec0df1328a02f233bca002b/packages/datamesh/src/lib/query.ts#L48)

***

### type

> **type**: `"Feature"`

Specifies the type of GeoJSON object.

#### Inherited from

`Omit.type`

#### Defined in

node\_modules/@types/geojson/index.d.ts:145
