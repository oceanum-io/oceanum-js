[**@oceanum/datamesh**](../README.md) • **Docs**

***

[@oceanum/datamesh](../README.md) / Connector

# Class: Connector

Datamesh connector class.

All datamesh operations are methods of this class.

## Constructors

### new Connector()

> **new Connector**(`token`, `service`, `gateway`): [`Connector`](Connector.md)

Datamesh connector constructor

#### Parameters

• **token**: `string` = `...`

Your datamesh access token. Defaults to environment variable DATAMESH_TOKEN is defined else as literal string "DATAMESH_TOKEN". DO NOT put your Datamesh token directly into public facing browser code.

• **service**: `string` = `...`

URL of datamesh service. Defaults to environment variable DATAMESH_SERVICE or "https://datamesh.oceanum.io".

• **gateway**: `string` = `...`

URL of gateway service. Defaults to "https://gateway.datamesh.oceanum.io".

#### Returns

[`Connector`](Connector.md)

#### Throws

- If a valid token is not provided.

#### Defined in

[connector.ts:26](https://github.com/oceanum-io/oceanum-js/blob/16e7839874a87c82d4c481b562840bf7ccac2d83/packages/datamesh/src/lib/connector.ts#L26)

## Accessors

### host

> `get` **host**(): `string`

Get datamesh host.

#### Returns

`string`

The datamesh server host.

#### Defined in

[connector.ts:63](https://github.com/oceanum-io/oceanum-js/blob/16e7839874a87c82d4c481b562840bf7ccac2d83/packages/datamesh/src/lib/connector.ts#L63)

## Methods

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

[connector.ts:198](https://github.com/oceanum-io/oceanum-js/blob/16e7839874a87c82d4c481b562840bf7ccac2d83/packages/datamesh/src/lib/connector.ts#L198)

***

### loadDatasource()

> **loadDatasource**(`datasourceId`, `parameters`): `Promise`\<`null` \| [`Dataset`](Dataset.md)\<`DatameshStore`\>\>

Load a datasource into the work environment.

#### Parameters

• **datasourceId**: `string`

Unique datasource ID.

• **parameters**: `Record`\<`string`, `string` \| `number`\> = `{}`

Additional datasource parameters.

#### Returns

`Promise`\<`null` \| [`Dataset`](Dataset.md)\<`DatameshStore`\>\>

The dataset.

#### Defined in

[connector.ts:215](https://github.com/oceanum-io/oceanum-js/blob/16e7839874a87c82d4c481b562840bf7ccac2d83/packages/datamesh/src/lib/connector.ts#L215)

***

### query()

> **query**(`query`): `Promise`\<`null` \| [`Dataset`](Dataset.md)\<`DatameshStore`\>\>

Execute a query to the datamesh.

#### Parameters

• **query**: [`IQuery`](../interfaces/IQuery.md)

The query to execute.

#### Returns

`Promise`\<`null` \| [`Dataset`](Dataset.md)\<`DatameshStore`\>\>

The response from the server.

#### Defined in

[connector.ts:178](https://github.com/oceanum-io/oceanum-js/blob/16e7839874a87c82d4c481b562840bf7ccac2d83/packages/datamesh/src/lib/connector.ts#L178)

***

### status()

> **status**(): `Promise`\<`boolean`\>

Check the status of the metadata server.

#### Returns

`Promise`\<`boolean`\>

True if the metadata server is up, false otherwise.

#### Defined in

[connector.ts:72](https://github.com/oceanum-io/oceanum-js/blob/16e7839874a87c82d4c481b562840bf7ccac2d83/packages/datamesh/src/lib/connector.ts#L72)
