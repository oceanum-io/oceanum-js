[**@oceanum/datamesh**](../README.md)

***

[@oceanum/datamesh](../README.md) / Connector

# Class: Connector

## Constructors

### new Connector()

> **new Connector**(`token`, `options`?): [`Connector`](Connector.md)

Datamesh connector constructor

#### Parameters

##### token

`string` = `...`

Your datamesh access token. Defaults to environment variable DATAMESH_TOKEN is defined else as literal string "DATAMESH_TOKEN". DO NOT put your Datamesh token directly into public facing browser code.

##### options?

Constructor options.

###### gateway

`string`

URL of gateway service. Defaults to "https://gateway.datamesh.oceanum.io".

###### jwtAuth

`string`

JWT for Oceanum service.

###### service

`string`

URL of datamesh service. Defaults to environment variable DATAMESH_SERVICE or "https://datamesh.oceanum.io".

#### Returns

[`Connector`](Connector.md)

#### Throws

- If a valid token is not provided.

#### Defined in

[packages/datamesh/src/lib/connector.ts:34](https://github.com/oceanum-io/oceanum-js/blob/8743de96e5f943db8ec0df1328a02f233bca002b/packages/datamesh/src/lib/connector.ts#L34)

## Properties

### LAZY\_LOAD\_SIZE

> `static` **LAZY\_LOAD\_SIZE**: `number` = `1e8`

#### Defined in

[packages/datamesh/src/lib/connector.ts:17](https://github.com/oceanum-io/oceanum-js/blob/8743de96e5f943db8ec0df1328a02f233bca002b/packages/datamesh/src/lib/connector.ts#L17)

## Accessors

### host

#### Get Signature

> **get** **host**(): `string`

Get datamesh host.

##### Returns

`string`

The datamesh server host.

#### Defined in

[packages/datamesh/src/lib/connector.ts:77](https://github.com/oceanum-io/oceanum-js/blob/8743de96e5f943db8ec0df1328a02f233bca002b/packages/datamesh/src/lib/connector.ts#L77)

## Methods

### getDatasource()

> **getDatasource**(`datasourceId`): `Promise`\<[`Datasource`](../type-aliases/Datasource.md)\>

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

#### Defined in

[packages/datamesh/src/lib/connector.ts:218](https://github.com/oceanum-io/oceanum-js/blob/8743de96e5f943db8ec0df1328a02f233bca002b/packages/datamesh/src/lib/connector.ts#L218)

***

### loadDatasource()

> **loadDatasource**(`datasourceId`, `parameters`): `Promise`\<`null` \| [`Dataset`](Dataset.md)\<`DatameshStore` \| `TempStore`\>\>

Load a datasource into the work environment.

#### Parameters

##### datasourceId

`string`

Unique datasource ID.

##### parameters

`Record`\<`string`, `string` \| `number`\> = `{}`

Additional datasource parameters.

#### Returns

`Promise`\<`null` \| [`Dataset`](Dataset.md)\<`DatameshStore` \| `TempStore`\>\>

The dataset.

#### Defined in

[packages/datamesh/src/lib/connector.ts:236](https://github.com/oceanum-io/oceanum-js/blob/8743de96e5f943db8ec0df1328a02f233bca002b/packages/datamesh/src/lib/connector.ts#L236)

***

### query()

> **query**(`query`): `Promise`\<`null` \| [`Dataset`](Dataset.md)\<`DatameshStore` \| `TempStore`\>\>

Execute a query to the datamesh.

#### Parameters

##### query

[`IQuery`](../interfaces/IQuery.md)

The query to execute.

#### Returns

`Promise`\<`null` \| [`Dataset`](Dataset.md)\<`DatameshStore` \| `TempStore`\>\>

The response from the server.

#### Defined in

[packages/datamesh/src/lib/connector.ts:191](https://github.com/oceanum-io/oceanum-js/blob/8743de96e5f943db8ec0df1328a02f233bca002b/packages/datamesh/src/lib/connector.ts#L191)

***

### stageRequest()

> **stageRequest**(`query`): `Promise`\<`null` \| `Stage`\>

Stage a query to the datamesh.

#### Parameters

##### query

[`IQuery`](../interfaces/IQuery.md)

The query to stage.

#### Returns

`Promise`\<`null` \| `Stage`\>

The staged response.

#### Defined in

[packages/datamesh/src/lib/connector.ts:167](https://github.com/oceanum-io/oceanum-js/blob/8743de96e5f943db8ec0df1328a02f233bca002b/packages/datamesh/src/lib/connector.ts#L167)

***

### status()

> **status**(): `Promise`\<`boolean`\>

Check the status of the metadata server.

#### Returns

`Promise`\<`boolean`\>

True if the server is up, false otherwise.

#### Defined in

[packages/datamesh/src/lib/connector.ts:86](https://github.com/oceanum-io/oceanum-js/blob/8743de96e5f943db8ec0df1328a02f233bca002b/packages/datamesh/src/lib/connector.ts#L86)
