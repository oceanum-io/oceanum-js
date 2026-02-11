[**@oceanum/layers**](../README.md)

***

[@oceanum/layers](../README.md) / OceanumPcolorLayer

# Class: OceanumPcolorLayer

Defined in: [packages/layers/src/oceanum-pcolor-layer.ts:20](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/layers/src/oceanum-pcolor-layer.ts#L20)

## Extends

- [`OceanumBaseLayer`](OceanumBaseLayer.md)

## Constructors

### Constructor

> **new OceanumPcolorLayer**(...`propObjects`): `OceanumPcolorLayer`

Defined in: node\_modules/@deck.gl/core/dist/lifecycle/component.d.ts:17

#### Parameters

##### propObjects

...`Partial`\<`Required`\<`CompositeLayerProps`\> & `Required`\<`LayerProps`\>\>[]

#### Returns

`OceanumPcolorLayer`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`constructor`](OceanumBaseLayer.md#constructor)

## Properties

### context

> **context**: `LayerContext`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:38

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`context`](OceanumBaseLayer.md#context)

***

### count

> **count**: `number`

Defined in: node\_modules/@deck.gl/core/dist/lifecycle/component.d.ts:16

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`count`](OceanumBaseLayer.md#count)

***

### id

> **id**: `string`

Defined in: node\_modules/@deck.gl/core/dist/lifecycle/component.d.ts:14

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`id`](OceanumBaseLayer.md#id)

***

### internalState

> **internalState**: `LayerState`\<`OceanumPcolorLayer`\> \| `null`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:36

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`internalState`](OceanumBaseLayer.md#internalstate)

***

### lifecycle

> **lifecycle**: `Lifecycle`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:37

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`lifecycle`](OceanumBaseLayer.md#lifecycle)

***

### parent

> **parent**: `Layer`\<\{ \}\> \| `null`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:40

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`parent`](OceanumBaseLayer.md#parent)

***

### props

> **props**: `StatefulComponentProps`\<`Required`\<`CompositeLayerProps`\> & `Required`\<`LayerProps`\>\>

Defined in: node\_modules/@deck.gl/core/dist/lifecycle/component.d.ts:15

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`props`](OceanumBaseLayer.md#props)

***

### state

> **state**: `SharedLayerState`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:39

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`state`](OceanumBaseLayer.md#state)

***

### defaultProps

> `static` **defaultProps**: `object`

Defined in: [packages/layers/src/oceanum-pcolor-layer.ts:22](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/layers/src/oceanum-pcolor-layer.ts#L22)

#### color

> **color**: `object`

##### color.type

> **type**: `string` = `"array"`

##### color.value

> **value**: `number`[]

#### material

> **material**: `boolean` = `false`

#### Overrides

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`defaultProps`](OceanumBaseLayer.md#defaultprops)

***

### layerName

> `static` **layerName**: `string` = `"OceanumPcolorLayer"`

Defined in: [packages/layers/src/oceanum-pcolor-layer.ts:21](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/layers/src/oceanum-pcolor-layer.ts#L21)

#### Overrides

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`layerName`](OceanumBaseLayer.md#layername)

## Accessors

### isComposite

#### Get Signature

> **get** **isComposite**(): `boolean`

Defined in: node\_modules/@deck.gl/core/dist/lib/composite-layer.d.ts:11

`true` if this layer renders other layers

##### Returns

`boolean`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`isComposite`](OceanumBaseLayer.md#iscomposite)

***

### isDrawable

#### Get Signature

> **get** **isDrawable**(): `boolean`

Defined in: node\_modules/@deck.gl/core/dist/lib/composite-layer.d.ts:13

`true` if the layer renders to screen

##### Returns

`boolean`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`isDrawable`](OceanumBaseLayer.md#isdrawable)

***

### isLoaded

#### Get Signature

> **get** **isLoaded**(): `boolean`

Defined in: node\_modules/@deck.gl/core/dist/lib/composite-layer.d.ts:15

Returns true if all async resources are loaded

##### Returns

`boolean`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`isLoaded`](OceanumBaseLayer.md#isloaded)

***

### root

#### Get Signature

> **get** **root**(): `Layer`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:41

##### Returns

`Layer`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`root`](OceanumBaseLayer.md#root)

***

### wrapLongitude

#### Get Signature

> **get** **wrapLongitude**(): `boolean`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:76

Returns true if using shader-based WGS84 longitude wrapping

##### Returns

`boolean`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`wrapLongitude`](OceanumBaseLayer.md#wraplongitude)

***

### componentName

#### Get Signature

> **get** `static` **componentName**(): `string`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:35

##### Returns

`string`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`componentName`](OceanumBaseLayer.md#componentname)

## Methods

### \_buildDatakeys()

> **\_buildDatakeys**(`coordNames`): `ScalarDatakeys`

Defined in: [packages/layers/src/oceanum-pcolor-layer.ts:33](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/layers/src/oceanum-pcolor-layer.ts#L33)

#### Parameters

##### coordNames

`CoordNames`

#### Returns

`ScalarDatakeys`

#### Overrides

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`_buildDatakeys`](OceanumBaseLayer.md#_builddatakeys)

***

### \_createInnerLayer()

> **\_createInnerLayer**(`slicedData`, `datakeys`): `PcolorLayer`

Defined in: [packages/layers/src/oceanum-pcolor-layer.ts:37](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/layers/src/oceanum-pcolor-layer.ts#L37)

#### Parameters

##### slicedData

`SlicedData`

##### datakeys

`ScalarDatakeys`

#### Returns

`PcolorLayer`

#### Overrides

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`_createInnerLayer`](OceanumBaseLayer.md#_createinnerlayer)

***

### \_disablePickingIndex()

> `protected` **\_disablePickingIndex**(`objectIndex`): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:169

#### Parameters

##### objectIndex

`number`

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`_disablePickingIndex`](OceanumBaseLayer.md#_disablepickingindex)

***

### \_drawLayer()

> **\_drawLayer**(`__namedParameters`): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:180

#### Parameters

##### \_\_namedParameters

###### parameters

`Parameters`

###### renderPass

`RenderPass`

###### shaderModuleProps

`any`

###### uniforms

`any`

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`_drawLayer`](OceanumBaseLayer.md#_drawlayer)

***

### \_finalize()

> **\_finalize**(): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:179

(Internal) Called by manager when layer is about to be disposed
Note: not guaranteed to be called on application shutdown

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`_finalize`](OceanumBaseLayer.md#_finalize)

***

### \_getAttributeManager()

> `protected` **\_getAttributeManager**(): `AttributeManager` \| `null`

Defined in: node\_modules/@deck.gl/core/dist/lib/composite-layer.d.ts:50

Override base Layer method

#### Returns

`AttributeManager` \| `null`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`_getAttributeManager`](OceanumBaseLayer.md#_getattributemanager)

***

### \_initialize()

> **\_initialize**(): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:172

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`_initialize`](OceanumBaseLayer.md#_initialize)

***

### \_postUpdate()

> `protected` **\_postUpdate**(`updateParams`, `forceUpdate`): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/composite-layer.d.ts:52

(Internal) Called after an update to rerender sub layers

#### Parameters

##### updateParams

`UpdateParameters`\<`OceanumPcolorLayer`\>

##### forceUpdate

`boolean`

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`_postUpdate`](OceanumBaseLayer.md#_postupdate)

***

### \_setModelAttributes()

> `protected` **\_setModelAttributes**(`model`, `changedAttributes`, `bufferLayoutChanged?`): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:163

Apply changed attributes to model

#### Parameters

##### model

`Model`

##### changedAttributes

##### bufferLayoutChanged?

`boolean`

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`_setModelAttributes`](OceanumBaseLayer.md#_setmodelattributes)

***

### \_transferState()

> **\_transferState**(`oldLayer`): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:174

(Internal) Called by layer manager to transfer state from an old layer

#### Parameters

##### oldLayer

`Layer`\<`Required`\<`CompositeLayerProps`\>\>

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`_transferState`](OceanumBaseLayer.md#_transferstate)

***

### \_update()

> **\_update**(): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:176

(Internal) Called by layer manager when a new layer is added or an existing layer is matched with a new instance

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`_update`](OceanumBaseLayer.md#_update)

***

### \_updateAttributes()

> `protected` **\_updateAttributes**(): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:153

Recalculate any attributes if needed

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`_updateAttributes`](OceanumBaseLayer.md#_updateattributes)

***

### \_updateAutoHighlight()

> `protected` **\_updateAutoHighlight**(`info`): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/composite-layer.d.ts:48

Update sub layers to highlight the hovered object

#### Parameters

##### info

###### color

`Uint8Array`\<`ArrayBufferLike`\> \| `null`

###### coordinate?

`number`[]

###### devicePixel?

\[`number`, `number`\]

###### index

`number`

###### layer

`Layer`\<\{ \}\> \| `null`

###### object?

`any`

###### picked

`boolean`

###### pixel?

\[`number`, `number`\]

###### pixelRatio

`number`

###### sourceLayer?

`Layer`\<\{ \}\> \| `null`

###### viewport?

`Viewport`

###### x

`number`

###### y

`number`

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`_updateAutoHighlight`](OceanumBaseLayer.md#_updateautohighlight)

***

### \_validateVariableProps()

> **\_validateVariableProps**(`props`): `string` \| `null`

Defined in: [packages/layers/src/oceanum-pcolor-layer.ts:24](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/layers/src/oceanum-pcolor-layer.ts#L24)

#### Parameters

##### props

[`OceanumLayerProps`](../interfaces/OceanumLayerProps.md)

#### Returns

`string` \| `null`

#### Overrides

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`_validateVariableProps`](OceanumBaseLayer.md#_validatevariableprops)

***

### \_variablePropsChanged()

> **\_variablePropsChanged**(`props`, `oldProps`): `boolean`

Defined in: [packages/layers/src/oceanum-base-layer.ts:246](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/layers/src/oceanum-base-layer.ts#L246)

#### Parameters

##### props

[`OceanumLayerProps`](../interfaces/OceanumLayerProps.md)

##### oldProps

[`OceanumLayerProps`](../interfaces/OceanumLayerProps.md)

#### Returns

`boolean`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`_variablePropsChanged`](OceanumBaseLayer.md#_variablepropschanged)

***

### activateViewport()

> **activateViewport**(`viewport`): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:145

Called when this layer is rendered into the given viewport

#### Parameters

##### viewport

`Viewport`

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`activateViewport`](OceanumBaseLayer.md#activateviewport)

***

### calculateInstancePickingColors()

> `protected` **calculateInstancePickingColors**(`attribute`, `__namedParameters`): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:159

Updater for the automatically populated instancePickingColors attribute

#### Parameters

##### attribute

`Attribute`

##### \_\_namedParameters

###### numInstances

`number`

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`calculateInstancePickingColors`](OceanumBaseLayer.md#calculateinstancepickingcolors)

***

### clone()

> **clone**(`newProps`): `any`

Defined in: node\_modules/@deck.gl/core/dist/lifecycle/component.d.ts:18

#### Parameters

##### newProps

`Partial`\<`PropsT`\>

#### Returns

`any`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`clone`](OceanumBaseLayer.md#clone)

***

### decodePickingColor()

> **decodePickingColor**(`color`): `number`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:95

#### Parameters

##### color

`any`

#### Returns

`number`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`decodePickingColor`](OceanumBaseLayer.md#decodepickingcolor)

***

### disablePickingIndex()

> **disablePickingIndex**(`objectIndex`): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:168

(Internal) Sets the picking color at the specified index to null picking color. Used for multi-depth picking.
This method may be overriden by layer implementations

#### Parameters

##### objectIndex

`number`

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`disablePickingIndex`](OceanumBaseLayer.md#disablepickingindex)

***

### draw()

> **draw**(`opts`): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:117

#### Parameters

##### opts

`DrawOptions`

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`draw`](OceanumBaseLayer.md#draw)

***

### encodePickingColor()

> **encodePickingColor**(`i`, `target?`): \[`number`, `number`, `number`\]

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:94

#### Parameters

##### i

`any`

##### target?

`number`[]

#### Returns

\[`number`, `number`, `number`\]

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`encodePickingColor`](OceanumBaseLayer.md#encodepickingcolor)

***

### filterSubLayer()

> **filterSubLayer**(`context`): `boolean`

Defined in: node\_modules/@deck.gl/core/dist/lib/composite-layer.d.ts:29

Filters sub layers at draw time. Return true if the sub layer should be drawn.

#### Parameters

##### context

`FilterContext`

#### Returns

`boolean`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`filterSubLayer`](OceanumBaseLayer.md#filtersublayer)

***

### finalizeState()

> **finalizeState**(): `void`

Defined in: [packages/layers/src/oceanum-base-layer.ts:239](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/layers/src/oceanum-base-layer.ts#L239)

Called once when layer is no longer matched and state will be discarded. Layers can destroy WebGL resources here.

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`finalizeState`](OceanumBaseLayer.md#finalizestate)

***

### getAttributeManager()

> **getAttributeManager**(): `AttributeManager` \| `null`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:84

Returns the attribute manager of this layer

#### Returns

`AttributeManager` \| `null`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`getAttributeManager`](OceanumBaseLayer.md#getattributemanager)

***

### getBounds()

> **getBounds**(): \[`number`[], `number`[]\] \| `null`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:107

#### Returns

\[`number`[], `number`[]\] \| `null`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`getBounds`](OceanumBaseLayer.md#getbounds)

***

### getChangeFlags()

> **getChangeFlags**(): `ChangeFlags` \| `undefined`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:187

Returns the current change flags

#### Returns

`ChangeFlags` \| `undefined`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`getChangeFlags`](OceanumBaseLayer.md#getchangeflags)

***

### getCurrentLayer()

> **getCurrentLayer**(): `Layer`\<`Required`\<`CompositeLayerProps`\>\> \| `null`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:87

Returns the most recent layer that matched to this state
(When reacting to an async event, this layer may no longer be the latest)

#### Returns

`Layer`\<`Required`\<`CompositeLayerProps`\>\> \| `null`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`getCurrentLayer`](OceanumBaseLayer.md#getcurrentlayer)

***

### getLoadOptions()

> **getLoadOptions**(): `any`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:89

Returns the default parse options for async props

#### Returns

`any`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`getLoadOptions`](OceanumBaseLayer.md#getloadoptions)

***

### getModels()

> **getModels**(): `Model`[]

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:80

Returns an array of models used by this layer, can be overriden by layer subclass

#### Returns

`Model`[]

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`getModels`](OceanumBaseLayer.md#getmodels)

***

### getNeedsRedraw()

> **getNeedsRedraw**(`opts?`): `string` \| `false`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:136

(Internal) Checks if this layer needs redraw

#### Parameters

##### opts?

###### clearRedrawFlags

`boolean`

Reset redraw flags to false after the check

#### Returns

`string` \| `false`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`getNeedsRedraw`](OceanumBaseLayer.md#getneedsredraw)

***

### getNumInstances()

> **getNumInstances**(): `number`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:101

Deduces number of instances. Intention is to support:
- Explicit setting of numInstances
- Auto-deduction for ES6 containers that define a size member
- Auto-deduction for Classic Arrays via the built-in length attribute
- Auto-deduction via arrays

#### Returns

`number`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`getNumInstances`](OceanumBaseLayer.md#getnuminstances)

***

### getPickingInfo()

> **getPickingInfo**(`__namedParameters`): `object`

Defined in: node\_modules/@deck.gl/core/dist/lib/composite-layer.d.ts:24

called to augment the info object that is bubbled up from a sublayer
override Layer.getPickingInfo() because decoding / setting uniform do
not apply to a composite layer.

#### Parameters

##### \_\_namedParameters

`GetPickingInfoParams`

#### Returns

`object`

##### color

> **color**: `Uint8Array`\<`ArrayBufferLike`\> \| `null`

##### coordinate?

> `optional` **coordinate**: `number`[]

##### devicePixel?

> `optional` **devicePixel**: \[`number`, `number`\]

##### index

> **index**: `number`

##### layer

> **layer**: `Layer`\<\{ \}\> \| `null`

##### object?

> `optional` **object**: `any`

##### picked

> **picked**: `boolean`

##### pixel?

> `optional` **pixel**: \[`number`, `number`\]

##### pixelRatio

> **pixelRatio**: `number`

##### sourceLayer?

> `optional` **sourceLayer**: `Layer`\<\{ \}\> \| `null`

##### viewport?

> `optional` **viewport**: `Viewport`

##### x

> **x**: `number`

##### y

> **y**: `number`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`getPickingInfo`](OceanumBaseLayer.md#getpickinginfo)

***

### getShaders()

> **getShaders**(`shaders`): `any`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:110

#### Parameters

##### shaders

`any`

#### Returns

`any`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`getShaders`](OceanumBaseLayer.md#getshaders)

***

### getStartIndices()

> **getStartIndices**(): `NumericArray` \| `null`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:106

Buffer layout describes how many attribute values are packed for each data object
The default (null) is one value each object.
Some data formats (e.g. paths, polygons) have various length. Their buffer layout
is in the form of [L0, L1, L2, ...]

#### Returns

`NumericArray` \| `null`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`getStartIndices`](OceanumBaseLayer.md#getstartindices)

***

### getSubLayerAccessor()

> `protected` **getSubLayerAccessor**\<`In`, `Out`\>(`accessor`): `Accessor`\<`In`, `Out`\>

Defined in: node\_modules/@deck.gl/core/dist/lib/composite-layer.d.ts:40

Some composite layers cast user data into another format before passing to sublayers
We need to unwrap them before calling the accessor so that they see the original data
objects

#### Type Parameters

##### In

`In`

##### Out

`Out`

#### Parameters

##### accessor

`Accessor`\<`In`, `Out`\>

#### Returns

`Accessor`\<`In`, `Out`\>

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`getSubLayerAccessor`](OceanumBaseLayer.md#getsublayeraccessor)

***

### getSubLayerClass()

> `protected` **getSubLayerClass**\<`T`\>(`subLayerId`, `DefaultLayerClass`): `ConstructorOf`\<`T`\>

Defined in: node\_modules/@deck.gl/core/dist/lib/composite-layer.d.ts:33

Returns sub layer class for a specific sublayer

#### Type Parameters

##### T

`T` *extends* `Layer`\<\{ \}\>

#### Parameters

##### subLayerId

`string`

##### DefaultLayerClass

`ConstructorOf`\<`T`\>

#### Returns

`ConstructorOf`\<`T`\>

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`getSubLayerClass`](OceanumBaseLayer.md#getsublayerclass)

***

### getSubLayerProps()

> `protected` **getSubLayerProps**(`sublayerProps?`): `any`

Defined in: node\_modules/@deck.gl/core/dist/lib/composite-layer.d.ts:42

Returns sub layer props for a specific sublayer

#### Parameters

##### sublayerProps?

###### id?

`string`

###### updateTriggers?

`Record`\<`string`, `any`\>

#### Returns

`any`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`getSubLayerProps`](OceanumBaseLayer.md#getsublayerprops)

***

### getSubLayerRow()

> `protected` **getSubLayerRow**\<`T`\>(`row`, `sourceObject`, `sourceObjectIndex`): `T`

Defined in: node\_modules/@deck.gl/core/dist/lib/composite-layer.d.ts:36

When casting user data into another format to pass to sublayers,
add reference to the original object and object index

#### Type Parameters

##### T

`T`

#### Parameters

##### row

`T`

##### sourceObject

`any`

##### sourceObjectIndex

`number`

#### Returns

`T`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`getSubLayerRow`](OceanumBaseLayer.md#getsublayerrow)

***

### getSubLayers()

> **getSubLayers**(): `Layer`\<\{ \}\>[]

Defined in: node\_modules/@deck.gl/core/dist/lib/composite-layer.d.ts:17

Return last rendered sub layers

#### Returns

`Layer`\<\{ \}\>[]

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`getSubLayers`](OceanumBaseLayer.md#getsublayers)

***

### hasUniformTransition()

> **hasUniformTransition**(): `boolean`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:143

Checks if this layer has ongoing uniform transition

#### Returns

`boolean`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`hasUniformTransition`](OceanumBaseLayer.md#hasuniformtransition)

***

### initializeState()

> **initializeState**(): `void`

Defined in: [packages/layers/src/oceanum-base-layer.ts:139](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/layers/src/oceanum-base-layer.ts#L139)

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`initializeState`](OceanumBaseLayer.md#initializestate)

***

### invalidateAttribute()

> `protected` **invalidateAttribute**(`name?`): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:147

Default implementation of attribute invalidation, can be redefined

#### Parameters

##### name?

`string`

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`invalidateAttribute`](OceanumBaseLayer.md#invalidateattribute)

***

### ~~isPickable()~~

> **isPickable**(): `boolean`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:78

#### Returns

`boolean`

#### Deprecated

Returns true if the layer is visible in the picking pass

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`isPickable`](OceanumBaseLayer.md#ispickable)

***

### needsUpdate()

> **needsUpdate**(): `boolean`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:141

(Internal) Checks if this layer needs a deep update

#### Returns

`boolean`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`needsUpdate`](OceanumBaseLayer.md#needsupdate)

***

### nullPickingColor()

> **nullPickingColor**(): `number`[]

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:93

#### Returns

`number`[]

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`nullPickingColor`](OceanumBaseLayer.md#nullpickingcolor)

***

### onClick()

> **onClick**(`info`, `pickingEvent`): `boolean`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:92

#### Parameters

##### info

###### color

`Uint8Array`\<`ArrayBufferLike`\> \| `null`

###### coordinate?

`number`[]

###### devicePixel?

\[`number`, `number`\]

###### index

`number`

###### layer

`Layer`\<\{ \}\> \| `null`

###### object?

`any`

###### picked

`boolean`

###### pixel?

\[`number`, `number`\]

###### pixelRatio

`number`

###### sourceLayer?

`Layer`\<\{ \}\> \| `null`

###### viewport?

`Viewport`

###### x

`number`

###### y

`number`

##### pickingEvent

`any`

#### Returns

`boolean`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`onClick`](OceanumBaseLayer.md#onclick)

***

### onHover()

> **onHover**(`info`, `pickingEvent`): `boolean`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:91

#### Parameters

##### info

###### color

`Uint8Array`\<`ArrayBufferLike`\> \| `null`

###### coordinate?

`number`[]

###### devicePixel?

\[`number`, `number`\]

###### index

`number`

###### layer

`Layer`\<\{ \}\> \| `null`

###### object?

`any`

###### picked

`boolean`

###### pixel?

\[`number`, `number`\]

###### pixelRatio

`number`

###### sourceLayer?

`Layer`\<\{ \}\> \| `null`

###### viewport?

`Viewport`

###### x

`number`

###### y

`number`

##### pickingEvent

`any`

#### Returns

`boolean`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`onHover`](OceanumBaseLayer.md#onhover)

***

### project()

> **project**(`xyz`): `number`[]

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:44

Projects a point with current view state from the current layer's coordinate system to screen

#### Parameters

##### xyz

`number`[]

#### Returns

`number`[]

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`project`](OceanumBaseLayer.md#project)

***

### projectPosition()

> **projectPosition**(`xyz`, `params?`): \[`number`, `number`, `number`\]

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:49

Projects a point with current view state from the current layer's coordinate system to the world space

#### Parameters

##### xyz

`number`[]

##### params?

###### autoOffset?

`boolean`

Whether to apply offset mode automatically as does the project shader module.
Offset mode places the origin of the common space at the given viewport's center. It is used in some use cases
to improve precision in the vertex shader due to the fp32 float limitation.
Use `autoOffset:false` if the returned position should not be dependent on the current viewport.
Default `true`

###### fromCoordinateOrigin?

\[`number`, `number`, `number`\]

The coordinate origin that the supplied position is in. Default to the same as `coordinateOrigin`.

###### fromCoordinateSystem?

`CoordinateSystem`

The coordinate system that the supplied position is in. Default to the same as `coordinateSystem`.

###### viewport?

`Viewport`

The viewport to use

#### Returns

\[`number`, `number`, `number`\]

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`projectPosition`](OceanumBaseLayer.md#projectposition)

***

### raiseError()

> **raiseError**(`error`, `message`): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:134

(Internal) Propagate an error event through the system

#### Parameters

##### error

`Error`

##### message

`string`

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`raiseError`](OceanumBaseLayer.md#raiseerror)

***

### renderLayers()

> **renderLayers**(): `any`

Defined in: [packages/layers/src/oceanum-base-layer.ts:470](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/layers/src/oceanum-base-layer.ts#L470)

#### Returns

`any`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`renderLayers`](OceanumBaseLayer.md#renderlayers)

***

### restorePickingColors()

> **restorePickingColors**(): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:171

(Internal) Re-enable all picking indices after multi-depth picking

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`restorePickingColors`](OceanumBaseLayer.md#restorepickingcolors)

***

### setChangeFlags()

> **setChangeFlags**(`flags`): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:189

Dirty some change flags, will be handled by updateLayer

#### Parameters

##### flags

`Partial`\<`ChangeFlags`\>

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`setChangeFlags`](OceanumBaseLayer.md#setchangeflags)

***

### setNeedsRedraw()

> **setNeedsRedraw**(): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:70

Sets the redraw flag for this layer, will trigger a redraw next animation frame

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`setNeedsRedraw`](OceanumBaseLayer.md#setneedsredraw)

***

### setNeedsUpdate()

> **setNeedsUpdate**(): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:72

Mark this layer as needs a deep update

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`setNeedsUpdate`](OceanumBaseLayer.md#setneedsupdate)

***

### setShaderModuleProps()

> **setShaderModuleProps**(...`props`): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:82

Update shader input parameters

#### Parameters

##### props

...\[`Partial`\<\{\[`key`: `string`\]: `Partial`\<`Record`\<`string`, `unknown`\> \| `undefined`\>; \}\>\]

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`setShaderModuleProps`](OceanumBaseLayer.md#setshadermoduleprops)

***

### setState()

> **setState**(`updateObject`): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/composite-layer.d.ts:20

Updates selected state members and marks the composite layer to need rerender

#### Parameters

##### updateObject

`any`

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`setState`](OceanumBaseLayer.md#setstate)

***

### shouldRenderSubLayer()

> `protected` **shouldRenderSubLayer**(`subLayerId`, `data`): `boolean`

Defined in: node\_modules/@deck.gl/core/dist/lib/composite-layer.d.ts:31

Returns true if sub layer needs to be rendered

#### Parameters

##### subLayerId

`string`

##### data

`any`

#### Returns

`boolean`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`shouldRenderSubLayer`](OceanumBaseLayer.md#shouldrendersublayer)

***

### shouldUpdateState()

> **shouldUpdateState**(`__namedParameters`): `boolean`

Defined in: [packages/layers/src/oceanum-base-layer.ts:167](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/layers/src/oceanum-base-layer.ts#L167)

Controls if updateState should be called. By default returns true if any prop has changed

#### Parameters

##### \_\_namedParameters

`any`

#### Returns

`boolean`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`shouldUpdateState`](OceanumBaseLayer.md#shouldupdatestate)

***

### toString()

> **toString**(): `string`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:42

Returns a string representation of an object.

#### Returns

`string`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`toString`](OceanumBaseLayer.md#tostring)

***

### unproject()

> **unproject**(`xy`): `number`[]

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:47

Unprojects a screen pixel to the current view's default coordinate system
Note: this does not reverse `project`.

#### Parameters

##### xy

`number`[]

#### Returns

`number`[]

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`unproject`](OceanumBaseLayer.md#unproject)

***

### updateAttributes()

> `protected` **updateAttributes**(`changedAttributes`): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:149

Send updated attributes to the WebGL model

#### Parameters

##### changedAttributes

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`updateAttributes`](OceanumBaseLayer.md#updateattributes)

***

### updateAutoHighlight()

> **updateAutoHighlight**(`info`): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:199

(Internal) Called by deck picker when the hovered object changes to update the auto highlight

#### Parameters

##### info

###### color

`Uint8Array`\<`ArrayBufferLike`\> \| `null`

###### coordinate?

`number`[]

###### devicePixel?

\[`number`, `number`\]

###### index

`number`

###### layer

`Layer`\<\{ \}\> \| `null`

###### object?

`any`

###### picked

`boolean`

###### pixel?

\[`number`, `number`\]

###### pixelRatio

`number`

###### sourceLayer?

`Layer`\<\{ \}\> \| `null`

###### viewport?

`Viewport`

###### x

`number`

###### y

`number`

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`updateAutoHighlight`](OceanumBaseLayer.md#updateautohighlight)

***

### updateState()

> **updateState**(`__namedParameters`): `void`

Defined in: [packages/layers/src/oceanum-base-layer.ts:171](https://github.com/oceanum-io/oceanum-js/blob/9514fbe955f07e31f96f0c079698cb0d5ff4e241/packages/layers/src/oceanum-base-layer.ts#L171)

Default implementation, all attributes will be invalidated and updated when data changes

#### Parameters

##### \_\_namedParameters

`any`

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`updateState`](OceanumBaseLayer.md#updatestate)

***

### use64bitPositions()

> **use64bitPositions**(): `boolean`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:90

#### Returns

`boolean`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`use64bitPositions`](OceanumBaseLayer.md#use64bitpositions)

***

### validateProps()

> **validateProps**(): `void`

Defined in: node\_modules/@deck.gl/core/dist/lib/layer.d.ts:197

(Internal) called by layer manager to perform extra props validation (in development only)

#### Returns

`void`

#### Inherited from

[`OceanumBaseLayer`](OceanumBaseLayer.md).[`validateProps`](OceanumBaseLayer.md#validateprops)
