# Using Sessions in Oceanum Datamesh

This guide explains how to use sessions in the Oceanum Datamesh JavaScript library. Sessions provide a way to manage authentication and resource allocation for datamesh operations, especially for long-running operations.

## Table of Contents

- [Introduction](#introduction)
- [Basic Session Usage](#basic-session-usage)
- [Session Lifecycle](#session-lifecycle)
- [Using Sessions with Zarr Data](#using-sessions-with-zarr-data)
- [Advanced Session Management](#advanced-session-management)
- [Best Practices](#best-practices)

## Introduction

Sessions in Oceanum Datamesh provide several benefits:

1. **Resource Management**: Sessions help manage server-side resources efficiently
2. **Authentication**: Sessions maintain authentication state across multiple requests
3. **Write Operations**: Sessions provide a way to manage and finalize write operations
4. **Performance**: Sessions can improve performance for long-running operations

The session support in the JavaScript library follows the same pattern as the Python library, making it familiar for developers who have used both libraries.

## Basic Session Usage

### Creating a Session

You can create a session using the `createSession` method on the `Connector` class:

```typescript
import { Connector } from "@oceanum/datamesh";

// Create a connector
const connector = new Connector(process.env.DATAMESH_TOKEN);

// Create a session
const session = await connector.createSession();
console.log(`Session created: ${session.id}`);
```

### Session Options

When creating a session, you can specify options such as the session duration:

```typescript
// Create a session that lasts for 2 hours
const session = await connector.createSession({ duration: 2 });
```

You can also set the default session duration when creating the connector:

```typescript
const connector = new Connector(process.env.DATAMESH_TOKEN, {
  sessionDuration: 2 // Default session duration of 2 hours
});
```

### Automatic Session Creation

The connector will automatically create a session when needed if you don't explicitly create one:

```typescript
// The connector will automatically create a session when needed
const datasource = await connector.getDatasource("example-datasource-id");

// Get the current session that was automatically created
const session = await connector.getSession();
console.log(`Automatically created session: ${session.id}`);
```

### Closing a Session

It's important to close sessions when you're done with them to free up server resources:

```typescript
// Close the session when done
await connector.closeSession();
```

If you've performed write operations during the session, you can finalize them when closing:

```typescript
// Close the session and finalize any write operations
await connector.closeSession(true);
```

## Session Lifecycle

A typical session lifecycle looks like this:

1. **Create a session** using `connector.createSession()`
2. **Perform operations** using the connector (the session headers are automatically included)
3. **Close the session** using `connector.closeSession()`

Here's a complete example:

```typescript
import { Connector } from "@oceanum/datamesh";

async function example() {
  // Create a connector
  const connector = new Connector(process.env.DATAMESH_TOKEN);
  
  try {
    // Create a session
    const session = await connector.createSession();
    console.log(`Session created: ${session.id}`);
    
    // Perform operations with the session
    const datasource = await connector.getDatasource("example-datasource-id");
    console.log(`Retrieved datasource: ${datasource.id}`);
    
    // Close the session when done
    await connector.closeSession();
    console.log("Session closed");
  } catch (error) {
    console.error("Error:", error);
    // Make sure to close the session even if there's an error
    await connector.closeSession();
  }
}
```

## Using Sessions with Zarr Data

Sessions are particularly useful when working with Zarr data, as they help maintain authentication state across multiple requests to the Zarr store.

```typescript
import { Connector } from "@oceanum/datamesh";

async function example() {
  const connector = new Connector(process.env.DATAMESH_TOKEN);
  
  try {
    // Create a session
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

### Using Sessions with Queries

When executing queries that involve Zarr data, sessions ensure that authentication is maintained throughout the query execution:

```typescript
import { Connector } from "@oceanum/datamesh";

async function example() {
  const connector = new Connector(process.env.DATAMESH_TOKEN);
  
  try {
    // Create a query to filter data
    const query = {
      datasource: "example-zarr-datasource-id",
      timefilter: {
        start: new Date("2023-01-01").toISOString(),
        end: new Date("2023-01-31").toISOString()
      }
    };
    
    // Execute the query - this will use session headers in all requests
    const dataset = await connector.query(query);
    
    if (dataset) {
      // Access data from the dataset
      const dataframe = await dataset.asDataframe();
      console.log(`Loaded ${dataframe.length} records from query result`);
    }
    
    // Close the session when done
    await connector.closeSession();
  } catch (error) {
    console.error("Error:", error);
    await connector.closeSession();
  }
}
```

## Advanced Session Management

### Using the Session Class Directly

You can also create and manage sessions directly using the `Session` class:

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
    console.log("Headers with session:", headers);
    
    // Close the session when done
    await session.close();
  } catch (error) {
    console.error("Error:", error);
    // Close the session but don't finalize writes if there was an error
    await session.close(false);
  }
}
```

### Session Context Management

The `Session` class provides methods for context management:

```typescript
import { Connector, Session } from "@oceanum/datamesh";

async function example() {
  const connector = new Connector(process.env.DATAMESH_TOKEN);
  const session = await Session.acquire(connector);
  
  try {
    // Enter the session context
    await session.enter();
    
    // Perform operations with the session
    
    // Exit the session context
    // This will close the session and finalize writes if no error occurred
    await session.exit();
  } catch (error) {
    // Exit the session context with an error
    // This will close the session without finalizing writes
    await session.exit(error);
    console.error("Error:", error);
  }
}
```

## Best Practices

1. **Always close sessions**: Make sure to close sessions when you're done with them to free up server resources.
2. **Use try/catch blocks**: Always use try/catch blocks to ensure sessions are closed even if an error occurs.
3. **Set appropriate session durations**: Set session durations that match your expected operation time to avoid sessions expiring during operations.
4. **Reuse sessions**: When performing multiple operations, reuse the same session instead of creating a new one for each operation.
5. **Finalize write operations**: When closing a session after write operations, set `finalizeWrite` to `true` to ensure all writes are properly finalized.

```typescript
// Example of best practices
import { Connector } from "@oceanum/datamesh";

async function example() {
  const connector = new Connector(process.env.DATAMESH_TOKEN, {
    sessionDuration: 2 // Set an appropriate session duration
  });
  
  try {
    // Create a session
    const session = await connector.createSession();
    
    // Reuse the session for multiple operations
    const datasource1 = await connector.getDatasource("example-datasource-id-1");
    const datasource2 = await connector.getDatasource("example-datasource-id-2");
    
    // Perform write operations
    // ...
    
    // Close the session and finalize writes
    await connector.closeSession(true);
  } catch (error) {
    console.error("Error:", error);
    // Make sure to close the session even if there's an error
    await connector.closeSession();
  }
}
```

By following these guidelines, you can effectively use sessions in your Oceanum Datamesh applications to improve performance, manage resources efficiently, and ensure proper authentication across multiple operations.
