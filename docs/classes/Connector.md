[**@oceanum/datamesh**](../README.md) • **Docs**

***

[@oceanum/datamesh](../packages.md) / Connector

# Class: Connector

Datamesh connector class.

All datamesh operations are methods of this class.

## Constructors

### new Connector()

> **new Connector**(`token`, `service`, `gateway`): [`Connector`](Connector.md)

Datamesh connector constructor

#### Parameters

• **token**: `string` = `...`

Your datamesh access token. Defaults to environment variable DATAMESH_TOKEN if defined else $DATAMESH_TOKEN

• **service**: `string` = `...`

URL of datamesh service. Defaults to environment variable DATAMESH_SERVICE or "https://datamesh.oceanum.io".

• **gateway**: `string` = `...`

URL of gateway service. Defaults to "https://gateway.<datamesh_service_domain>".

#### Returns

[`Connector`](Connector.md)

#### Throws

- If a valid token is not provided.

#### Defined in

[connector.ts:26](https://github.com/oceanum-io/oceanum-js/blob/9448ff9235fa530de87f8083974fe4591062d735/packages/datamesh/src/lib/connector.ts#L26)

## Accessors

### host

> `get` **host**(): `string`

Get datamesh host.

#### Returns

`string`

The datamesh server host.

#### Defined in

[connector.ts:62](https://github.com/oceanum-io/oceanum-js/blob/9448ff9235fa530de87f8083974fe4591062d735/packages/datamesh/src/lib/connector.ts#L62)

## Methods

### dataRequest()

> **dataRequest**(`datasourceId`, `dataFormat`): `Promise`\<`Blob`\>

Request data from datamesh.

#### Parameters

• **datasourceId**: `string`

The ID of the datasource to request.

• **dataFormat**: `string` = `"application/json"`

The format of the requested data. Defaults to "application/json".

#### Returns

`Promise`\<`Blob`\>

The path to the cached file.

#### Defined in

[connector.ts:136](https://github.com/oceanum-io/oceanum-js/blob/9448ff9235fa530de87f8083974fe4591062d735/packages/datamesh/src/lib/connector.ts#L136)

***

### getDatasource()

> **getDatasource**(`datasourceId`): `Promise`\<[`Datasource`](../type-aliases/Datasource.md)\>

Get a datasource instance from the datamesh.

#### Parameters

• **datasourceId**: `string`

Unique datasource ID.

#### Returns

`Promise`\<[`Datasource`](../type-aliases/Datasource.md)\>

The datasource instance.

#### Throws

- If the datasource cannot be found or is not authorized.

#### Defined in

[connector.ts:194](https://github.com/oceanum-io/oceanum-js/blob/9448ff9235fa530de87f8083974fe4591062d735/packages/datamesh/src/lib/connector.ts#L194)

***

### loadDatasource()

> **loadDatasource**(`datasourceId`, `parameters`): `Promise`\<`null` \| `Dataset`\<`DatameshStore`\>\>

Load a datasource into the work environment.

#### Parameters

• **datasourceId**: `string`

Unique datasource ID.

• **parameters**: `Record`\<`string`, `string` \| `number`\> = `{}`

Additional datasource parameters.

#### Returns

`Promise`\<`null` \| `Dataset`\<`DatameshStore`\>\>

The datasource container.

#### Defined in

[connector.ts:212](https://github.com/oceanum-io/oceanum-js/blob/9448ff9235fa530de87f8083974fe4591062d735/packages/datamesh/src/lib/connector.ts#L212)

***

### query()

> **query**(`query`): `Promise`\<`null` \| `Dataset`\<`DatameshStore`\>\>

Execute a query to the datamesh.

#### Parameters

• **query**: `IQuery`

The query to execute.

#### Returns

`Promise`\<`null` \| `Dataset`\<`DatameshStore`\>\>

The response from the server.

#### Defined in

[connector.ts:176](https://github.com/oceanum-io/oceanum-js/blob/9448ff9235fa530de87f8083974fe4591062d735/packages/datamesh/src/lib/connector.ts#L176)

***

### status()

> **status**(): `Promise`\<`boolean`\>

Check the status of the metadata server.

#### Returns

`Promise`\<`boolean`\>

True if the metadata server is up, false otherwise.

#### Defined in

[connector.ts:71](https://github.com/oceanum-io/oceanum-js/blob/9448ff9235fa530de87f8083974fe4591062d735/packages/datamesh/src/lib/connector.ts#L71)
