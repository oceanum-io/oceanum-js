[**@oceanum/datamesh**](../README.md)

***

[@oceanum/datamesh](../README.md) / Session

# Class: Session

Session class for datamesh connections. Sessions are used to manage authentication and resource allocation for datamesh operations.

## Table of Contents

- [Constructor](#constructor)
- [Properties](#properties)
- [Methods](#methods)
  - [acquire](#acquire)
  - [addHeader](#addheader)
  - [close](#close)
  - [enter](#enter)
  - [exit](#exit)
- [Usage Examples](#usage-examples)
  - [Basic Session Usage](#basic-session-usage)
  - [Using Session with Zarr Data](#using-session-with-zarr-data)
  - [Session Context Management](#session-context-management)

## Constructor

The Session class is not typically instantiated directly. Instead, use the static `acquire` method or the `createSession` method on the Connector class.

## Properties

### id

> **id**: `string`

The unique identifier for the session.

### user

> **user**: `string`

The user associated with the session.

### creationTime

> **creationTime**: `Date`

The time when the session was created.

### endTime

> **endTime**: `Date`

The time when the session will expire.

### write

> **write**: `boolean`

Whether the session has write access.

### verified

> **verified**: `boolean` = `false`

Whether the session has been verified.

## Methods

### acquire

> `static` **acquire**(`connection`, `options`): `Promise<Session>`

Acquire a session from the connection.

#### Parameters

##### connection

`Connector`

Connection object to acquire session from.

##### options

`object`

Session options.

###### duration?

`number`

The desired length of time for the session in hours. Defaults to 1 hour.

#### Returns

`Promise<Session>`

A new session instance.

#### Throws

- If the session cannot be acquired.

***

### addHeader

> **addHeader**(`headers`): `Record<string, string>`

Add session header to an existing headers object.

#### Parameters

##### headers

`Record<string, string>`

The headers object to add the session header to.

#### Returns

`Record<string, string>`

The updated headers object.

***

### close

> **close**(`finaliseWrite`): `Promise<void>`

Close the session.

#### Parameters

##### finaliseWrite

`boolean` = `false`

Whether to finalise any write operations. Defaults to false.

#### Returns

`Promise<void>`

#### Throws

- If the session cannot be closed and finaliseWrite is true.

***

### enter

> **enter**(): `Promise<Session>`

Enter a session context.

#### Returns

`Promise<Session>`

The session instance.

***

### exit

> **exit**(`error`): `Promise<void>`

Exit a session context.

#### Parameters

##### error

`any`

Any error that occurred during the session.

#### Returns

`Promise<void>`

A promise that resolves when the session is closed.

## Usage Examples

### Basic Session Usage

```typescript
import { Connector } from "@oceanum/datamesh";

async function example() {
  // Create a connector with session support
  const connector = new Connector(process.env.DATAMESH_TOKEN);
  
  // Create a session explicitly
  const session = await connector.createSession();
  console.log(`Session created: ${session.id}`);
  
  try {
    // Use the connector with the session
    // The session header will be automatically included in all requests
    const datasource = await connector.getDatasource("example-datasource-id");
    console.log(`Retrieved datasource: ${datasource.id}`);
    
    // Close the session when done
    await connector.closeSession();
  } catch (error) {
    console.error("Error:", error);
    // Make sure to close the session even if there's an error
    await connector.closeSession();
  }
}
```

### Using Session with Zarr Data

```typescript
import { Connector } from "@oceanum/datamesh";

async function example() {
  // Create a connector with session support
  const connector = new Connector(process.env.DATAMESH_TOKEN);
  
  try {
    // Create a session explicitly
    const session = await connector.createSession();
    
    // Load a datasource that uses Zarr for storage
    // The session headers will be automatically included in all Zarr requests
    const dataset = await connector.loadDatasource("example-zarr-datasource-id");
    
    if (dataset) {
      // Access data from the dataset
      // This will use the session headers when making Zarr requests
      const dataframe = await dataset.asDataframe();
      console.log(`Loaded ${dataframe.length} records from dataset`);
    }
    
    // Close the session when done
    await connector.closeSession();
  } catch (error) {
    console.error("Error:", error);
    await connector.closeSession();
  }
}
```

### Session Context Management

```typescript
import { Connector, Session } from "@oceanum/datamesh";

async function example() {
  const connector = new Connector(process.env.DATAMESH_TOKEN);
  
  // Create a session directly using the Session class
  const session = await Session.acquire(connector, { duration: 1 });
  
  try {
    // Use the session to add headers to requests
    const headers = {};
    session.addHeader(headers);
    
    // Perform operations with the session
    
    // Close the session when done
    await session.close();
  } catch (error) {
    // Close the session but don't finalise writes if there was an error
    await session.close(false);
    console.error("Error:", error);
  }
}
```
