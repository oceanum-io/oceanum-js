[**@oceanum/datamesh**](../../README.md)

***

[@oceanum/datamesh](../../README.md) / [index](../README.md) / Connector

# Class: Connector

Defined in: [packages/datamesh/src/lib/connector.ts:19](https://github.com/oceanum-io/oceanum-js/blob/caaf80b4ce3f936efe18d2244930ed354860c5c1/packages/datamesh/src/lib/connector.ts#L19)

## Constructors

### Constructor

> **new Connector**(`token`, `options?`): `Connector`

Defined in: [packages/datamesh/src/lib/connector.ts:45](https://github.com/oceanum-io/oceanum-js/blob/caaf80b4ce3f936efe18d2244930ed354860c5c1/packages/datamesh/src/lib/connector.ts#L45)

Datamesh connector constructor

#### Parameters

##### token

`string` = `...`

Your datamesh access token. Defaults to environment variable DATAMESH_TOKEN is defined else as literal string "DATAMESH_TOKEN". DO NOT put your Datamesh token directly into public facing browser code.

##### options?

Constructor options.

###### gateway?

`string`

URL of gateway service. Defaults to "https://gateway.<datamesh_service_domain>".

###### jwtAuth?

`string`

JWT for Oceanum service.

###### nocache?

`boolean`

Disable caching of datamesh results.

###### service?

`string`

URL of datamesh service. Defaults to environment variable DATAMESH_SERVICE or "https://datamesh.oceanum.io".

###### sessionDuration?

`number`

The desired length of time for acquired datamesh sessions in hours. Will be 1 hour by default.

#### Returns

`Connector`

#### Throws

- If a valid token is not provided.

## Properties

### gateway?

> `optional` **gateway**: `string`

Defined in: [packages/datamesh/src/lib/connector.ts:30](https://github.com/oceanum-io/oceanum-js/blob/caaf80b4ce3f936efe18d2244930ed354860c5c1/packages/datamesh/src/lib/connector.ts#L30)

***

### service?

> `optional` **service**: `string`

Defined in: [packages/datamesh/src/lib/connector.ts:29](https://github.com/oceanum-io/oceanum-js/blob/caaf80b4ce3f936efe18d2244930ed354860c5c1/packages/datamesh/src/lib/connector.ts#L29)

***

### LAZY\_LOAD\_SIZE

> `static` **LAZY\_LOAD\_SIZE**: `number` = `1e8`

Defined in: [packages/datamesh/src/lib/connector.ts:20](https://github.com/oceanum-io/oceanum-js/blob/caaf80b4ce3f936efe18d2244930ed354860c5c1/packages/datamesh/src/lib/connector.ts#L20)

## Accessors

### host

#### Get Signature

> **get** **host**(): `string`

Defined in: [packages/datamesh/src/lib/connector.ts:129](https://github.com/oceanum-io/oceanum-js/blob/caaf80b4ce3f936efe18d2244930ed354860c5c1/packages/datamesh/src/lib/connector.ts#L129)

Get datamesh host.

##### Returns

`string`

The datamesh server host.

## Methods

### closeSession()

> **closeSession**(`finaliseWrite`): `Promise`\<`void`\>

Defined in: [packages/datamesh/src/lib/connector.ts:390](https://github.com/oceanum-io/oceanum-js/blob/caaf80b4ce3f936efe18d2244930ed354860c5c1/packages/datamesh/src/lib/connector.ts#L390)

Close the current session if one exists.

#### Parameters

##### finaliseWrite

`boolean` = `false`

Whether to finalise any write operations. Defaults to false.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the session is closed.

***

### createSession()

> **createSession**(`options`): `Promise`\<`Session`\>

Defined in: [packages/datamesh/src/lib/connector.ts:171](https://github.com/oceanum-io/oceanum-js/blob/caaf80b4ce3f936efe18d2244930ed354860c5c1/packages/datamesh/src/lib/connector.ts#L171)

Create a new session.

#### Parameters

##### options

Session options.

###### duration?

`number`

The desired length of time for the session in hours. Defaults to the value set in the constructor or 1 hour.

#### Returns

`Promise`\<`Session`\>

A new session instance.

***

### getDatasource()

> **getDatasource**(`datasourceId`): `Promise`\<[`Datasource`](../type-aliases/Datasource.md)\>

Defined in: [packages/datamesh/src/lib/connector.ts:357](https://github.com/oceanum-io/oceanum-js/blob/caaf80b4ce3f936efe18d2244930ed354860c5c1/packages/datamesh/src/lib/connector.ts#L357)

Get a datasource instance from the datamesh.

#### Parameters

##### datasourceId

`string`

Unique datasource ID.

#### Returns

`Promise`\<[`Datasource`](../type-aliases/Datasource.md)\>

The datasource instance.

#### Throws

- If the datasource cannot be found or is not authorized.

***

### getSession()

> **getSession**(): `Promise`\<`Session`\>

Defined in: [packages/datamesh/src/lib/connector.ts:184](https://github.com/oceanum-io/oceanum-js/blob/caaf80b4ce3f936efe18d2244930ed354860c5c1/packages/datamesh/src/lib/connector.ts#L184)

Get the current session or create a new one if none exists.

#### Returns

`Promise`\<`Session`\>

The current session.

***

### loadDatasource()

> **loadDatasource**(`datasourceId`, `parameters`): `Promise`\<[`Dataset`](Dataset.md)\<`HttpZarr` \| `TempZarr`\>\>

Defined in: [packages/datamesh/src/lib/connector.ts:375](https://github.com/oceanum-io/oceanum-js/blob/caaf80b4ce3f936efe18d2244930ed354860c5c1/packages/datamesh/src/lib/connector.ts#L375)

Load a datasource into the work environment.

#### Parameters

##### datasourceId

`string`

Unique datasource ID.

##### parameters

`Record`\<`string`, `string` \| `number`\> = `{}`

Additional datasource parameters.

#### Returns

`Promise`\<[`Dataset`](Dataset.md)\<`HttpZarr` \| `TempZarr`\>\>

The dataset.

***

### query()

> **query**(`query`, `options`): `Promise`\<[`Dataset`](Dataset.md)\<`HttpZarr` \| `TempZarr`\>\>

Defined in: [packages/datamesh/src/lib/connector.ts:302](https://github.com/oceanum-io/oceanum-js/blob/caaf80b4ce3f936efe18d2244930ed354860c5c1/packages/datamesh/src/lib/connector.ts#L302)

Execute a query to the datamesh.

#### Parameters

##### query

[`IQuery`](../interfaces/IQuery.md)

The query to execute.

##### options

###### timeout?

`number`

Additional options for the query.

#### Returns

`Promise`\<[`Dataset`](Dataset.md)\<`HttpZarr` \| `TempZarr`\>\>

The response from the server.

***

### stageRequest()

> **stageRequest**(`query`): `Promise`\<`Stage`\>

Defined in: [packages/datamesh/src/lib/connector.ts:269](https://github.com/oceanum-io/oceanum-js/blob/caaf80b4ce3f936efe18d2244930ed354860c5c1/packages/datamesh/src/lib/connector.ts#L269)

Stage a query to the datamesh.

#### Parameters

##### query

[`IQuery`](../interfaces/IQuery.md)

The query to stage.

#### Returns

`Promise`\<`Stage`\>

The staged response.

***

### status()

> **status**(): `Promise`\<`boolean`\>

Defined in: [packages/datamesh/src/lib/connector.ts:138](https://github.com/oceanum-io/oceanum-js/blob/caaf80b4ce3f936efe18d2244930ed354860c5c1/packages/datamesh/src/lib/connector.ts#L138)

Check the status of the metadata server.

#### Returns

`Promise`\<`boolean`\>

True if the server is up, false otherwise.
