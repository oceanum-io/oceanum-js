[**@oceanum/datamesh**](../README.md)

***

[@oceanum/datamesh](../README.md) / Connector

# Class: Connector

Datamesh connector class. All datamesh operations are methods of this class.

## Table of Contents

- [Constructors](#constructors)
- [Properties](#properties)
- [Accessors](#accessors)
- [Methods](#methods)
  - [Session Management](#session-management)
  - [Data Operations](#data-operations)

## Constructors

### new Connector()

> **new Connector**(`token`, `options`?): [`Connector`](Connector.md)

Datamesh connector constructor

#### Parameters

##### token

`string` = `process.env.DATAMESH_TOKEN || "$DATAMESH_TOKEN"`

Your datamesh access token. Defaults to environment variable DATAMESH_TOKEN is defined else as literal string "DATAMESH_TOKEN". DO NOT put your Datamesh token directly into public facing browser code.

##### options?

Constructor options.

###### gateway?

`string`

URL of gateway service. Defaults to "https://gateway.datamesh.oceanum.io".

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

[`Connector`](Connector.md)

#### Throws

- If a valid token is not provided.

## Properties

### LAZY\_LOAD\_SIZE

> `static` **LAZY\_LOAD\_SIZE**: `number` = `1e8`

## Accessors

### host

#### Get Signature

> **get** **host**(): `string`

Get datamesh host.

##### Returns

`string`

The datamesh server host.

## Methods

### Session Management

#### createSession()

> **createSession**(`options`): `Promise`\<[`Session`](Session.md)\>

Create a new session.

##### Parameters

###### options

`object` = `{}`

Session options.

####### duration?

`number`

The desired length of time for the session in hours. Defaults to the value set in the constructor or 1 hour.

##### Returns

`Promise`\<[`Session`](Session.md)\>

A new session instance.

***

#### getSession()

> **getSession**(): `Promise`\<[`Session`](Session.md)\>

Get the current session or create a new one if none exists.

##### Returns

`Promise`\<[`Session`](Session.md)\>

The current session.

***

#### closeSession()

> **closeSession**(`finaliseWrite`): `Promise`\<`void`\>

Close the current session if one exists.

##### Parameters

###### finaliseWrite

`boolean` = `false`

Whether to finalise any write operations. Defaults to false.

##### Returns

`Promise`\<`void`\>

A promise that resolves when the session is closed.

### Data Operations

#### getDatasource()

> **getDatasource**(`datasourceId`): `Promise`\<[`Datasource`](../type-aliases/Datasource.md)\>

Get a datasource instance from the datamesh.

##### Parameters

###### datasourceId

`string`

Unique datasource ID.

##### Returns

`Promise`\<[`Datasource`](../type-aliases/Datasource.md)\>

The datasource instance.

##### Throws

- If the datasource cannot be found or is not authorized.

***

#### loadDatasource()

> **loadDatasource**(`datasourceId`, `parameters`): `Promise`\<`null` \| [`Dataset`](Dataset.md)\<`HttpZarr` \| `TempZarr`\>\>

Load a datasource into the work environment.

##### Parameters

###### datasourceId

`string`

Unique datasource ID.

###### parameters

`Record`\<`string`, `string` \| `number`\> = `{}`

Additional datasource parameters.

##### Returns

`Promise`\<`null` \| [`Dataset`](Dataset.md)\<`HttpZarr` \| `TempZarr`\>\>

The dataset.

***

#### query()

> **query**(`query`, `options`): `Promise`\<`null` \| [`Dataset`](Dataset.md)\<`HttpZarr` \| `TempZarr`\>\>

Execute a query to the datamesh.

##### Parameters

###### query

[`IQuery`](../interfaces/IQuery.md)

The query to execute.

###### options

`object` = `{}`

####### timeout?

`number`

Additional options for the query.

##### Returns

`Promise`\<`null` \| [`Dataset`](Dataset.md)\<`HttpZarr` \| `TempZarr`\>\>

The response from the server.

***

#### stageRequest()

> **stageRequest**(`query`): `Promise`\<`null` \| `Stage`\>

Stage a query to the datamesh.

##### Parameters

###### query

[`IQuery`](../interfaces/IQuery.md)

The query to stage.

##### Returns

`Promise`\<`null` \| `Stage`\>

The staged response.

***

#### status()

> **status**(): `Promise`\<`boolean`\>

Check the status of the metadata server.

##### Returns

`Promise`\<`boolean`\>

True if the server is up, false otherwise.
