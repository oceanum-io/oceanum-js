[**@oceanum/datamesh v0.4.1**](../README.md)

***

[@oceanum/datamesh](../README.md) / Connector

# Class: Connector

Defined in: [packages/datamesh/src/lib/connector.ts:17](https://github.com/oceanum-io/oceanum-js/blob/6ea95bc75340e32d4166044b1046d4453dd46745/packages/datamesh/src/lib/connector.ts#L17)

## Constructors

### Constructor

> **new Connector**(`token`, `options`?): `Connector`

Defined in: [packages/datamesh/src/lib/connector.ts:43](https://github.com/oceanum-io/oceanum-js/blob/6ea95bc75340e32d4166044b1046d4453dd46745/packages/datamesh/src/lib/connector.ts#L43)

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

Defined in: [packages/datamesh/src/lib/connector.ts:28](https://github.com/oceanum-io/oceanum-js/blob/6ea95bc75340e32d4166044b1046d4453dd46745/packages/datamesh/src/lib/connector.ts#L28)

***

### service?

> `optional` **service**: `string`

Defined in: [packages/datamesh/src/lib/connector.ts:27](https://github.com/oceanum-io/oceanum-js/blob/6ea95bc75340e32d4166044b1046d4453dd46745/packages/datamesh/src/lib/connector.ts#L27)

***

### LAZY\_LOAD\_SIZE

> `static` **LAZY\_LOAD\_SIZE**: `number` = `1e8`

Defined in: [packages/datamesh/src/lib/connector.ts:18](https://github.com/oceanum-io/oceanum-js/blob/6ea95bc75340e32d4166044b1046d4453dd46745/packages/datamesh/src/lib/connector.ts#L18)

## Accessors

### host

#### Get Signature

> **get** **host**(): `string`

Defined in: [packages/datamesh/src/lib/connector.ts:140](https://github.com/oceanum-io/oceanum-js/blob/6ea95bc75340e32d4166044b1046d4453dd46745/packages/datamesh/src/lib/connector.ts#L140)

Get datamesh host.

##### Returns

`string`

The datamesh server host.

## Methods

### closeSession()

> **closeSession**(`finaliseWrite`): `Promise`\<`void`\>

Defined in: [packages/datamesh/src/lib/connector.ts:403](https://github.com/oceanum-io/oceanum-js/blob/6ea95bc75340e32d4166044b1046d4453dd46745/packages/datamesh/src/lib/connector.ts#L403)

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

Defined in: [packages/datamesh/src/lib/connector.ts:182](https://github.com/oceanum-io/oceanum-js/blob/6ea95bc75340e32d4166044b1046d4453dd46745/packages/datamesh/src/lib/connector.ts#L182)

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

Defined in: [packages/datamesh/src/lib/connector.ts:370](https://github.com/oceanum-io/oceanum-js/blob/6ea95bc75340e32d4166044b1046d4453dd46745/packages/datamesh/src/lib/connector.ts#L370)

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

Defined in: [packages/datamesh/src/lib/connector.ts:195](https://github.com/oceanum-io/oceanum-js/blob/6ea95bc75340e32d4166044b1046d4453dd46745/packages/datamesh/src/lib/connector.ts#L195)

Get the current session or create a new one if none exists.

#### Returns

`Promise`\<`Session`\>

The current session.

***

### loadDatasource()

> **loadDatasource**(`datasourceId`, `parameters`): `Promise`\<`null` \| [`Dataset`](Dataset.md)\<`HttpZarr` \| `TempZarr`\>\>

Defined in: [packages/datamesh/src/lib/connector.ts:388](https://github.com/oceanum-io/oceanum-js/blob/6ea95bc75340e32d4166044b1046d4453dd46745/packages/datamesh/src/lib/connector.ts#L388)

Load a datasource into the work environment.

#### Parameters

##### datasourceId

`string`

Unique datasource ID.

##### parameters

`Record`\<`string`, `string` \| `number`\> = `{}`

Additional datasource parameters.

#### Returns

`Promise`\<`null` \| [`Dataset`](Dataset.md)\<`HttpZarr` \| `TempZarr`\>\>

The dataset.

***

### query()

> **query**(`query`, `options`): `Promise`\<`null` \| [`Dataset`](Dataset.md)\<`HttpZarr` \| `TempZarr`\>\>

Defined in: [packages/datamesh/src/lib/connector.ts:309](https://github.com/oceanum-io/oceanum-js/blob/6ea95bc75340e32d4166044b1046d4453dd46745/packages/datamesh/src/lib/connector.ts#L309)

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

`Promise`\<`null` \| [`Dataset`](Dataset.md)\<`HttpZarr` \| `TempZarr`\>\>

The response from the server.

***

### stageRequest()

> **stageRequest**(`query`): `Promise`\<`null` \| `Stage`\>

Defined in: [packages/datamesh/src/lib/connector.ts:280](https://github.com/oceanum-io/oceanum-js/blob/6ea95bc75340e32d4166044b1046d4453dd46745/packages/datamesh/src/lib/connector.ts#L280)

Stage a query to the datamesh.

#### Parameters

##### query

[`IQuery`](../interfaces/IQuery.md)

The query to stage.

#### Returns

`Promise`\<`null` \| `Stage`\>

The staged response.

***

### status()

> **status**(): `Promise`\<`boolean`\>

Defined in: [packages/datamesh/src/lib/connector.ts:149](https://github.com/oceanum-io/oceanum-js/blob/6ea95bc75340e32d4166044b1046d4453dd46745/packages/datamesh/src/lib/connector.ts#L149)

Check the status of the metadata server.

#### Returns

`Promise`\<`boolean`\>

True if the server is up, false otherwise.
