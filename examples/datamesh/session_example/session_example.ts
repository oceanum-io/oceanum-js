/**
 * Example demonstrating how to use sessions with the oceanum-js datamesh library
 * 
 * Sessions provide a way to manage authentication and resource allocation
 * for datamesh operations, especially for long-running operations.
 */

import { Connector } from "../../../packages/datamesh/src/lib/connector";
import { Session } from "../../../packages/datamesh/src/lib/session";

// Example 1: Basic session usage
async function basicSessionExample() {
  console.log("Example 1: Basic session usage");
  
  // Create a connector with session support
  const connector = new Connector(
    process.env.DATAMESH_TOKEN,
    {
      sessionDuration: 2 // Session will last for 2 hours
    }
  );
  
  // Create a session explicitly
  const session = await connector.createSession();
  console.log(`Session created: ${session.id}`);
  console.log(`Session user: ${session.user}`);
  console.log(`Session creation time: ${session.creationTime}`);
  console.log(`Session end time: ${session.endTime}`);
  
  try {
    // Use the connector with the session
    // The session header will be automatically included in all requests
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

// Example 2: Using automatic session creation
async function automaticSessionExample() {
  console.log("\nExample 2: Automatic session creation");
  
  // Create a connector without explicitly creating a session
  const connector = new Connector(process.env.DATAMESH_TOKEN);
  
  try {
    // The connector will automatically create a session when needed
    const datasource = await connector.getDatasource("example-datasource-id");
    console.log(`Retrieved datasource: ${datasource.id}`);
    
    // Get the current session that was automatically created
    const session = await connector.getSession();
    console.log(`Automatically created session: ${session.id}`);
    
    // Close the session when done
    await connector.closeSession();
    console.log("Session closed");
  } catch (error) {
    console.error("Error:", error);
    await connector.closeSession();
  }
}

// Example 3: Using the Session class directly
async function directSessionExample() {
  console.log("\nExample 3: Using Session class directly");
  
  const connector = new Connector(process.env.DATAMESH_TOKEN);
  
  // Create a session directly using the Session class
  try {
    const session = await Session.acquire(connector, { duration: 1 });
    console.log(`Session created directly: ${session.id}`);
    
    // Use the session to add headers to requests
    const headers = {};
    session.addHeader(headers);
    console.log("Headers with session:", headers);
    
    // Close the session when done
    await session.close();
    console.log("Session closed");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 4: Using session with async/await pattern
async function asyncAwaitSessionExample() {
  console.log("\nExample 4: Using session with async/await pattern");
  
  const connector = new Connector(process.env.DATAMESH_TOKEN);
  
  try {
    // Create a session
    const session = await connector.createSession();
    console.log(`Session created: ${session.id}`);
    
    // Perform multiple operations with the same session
    const datasource1 = await connector.getDatasource("example-datasource-id-1");
    console.log(`Retrieved datasource 1: ${datasource1.id}`);
    
    const datasource2 = await connector.getDatasource("example-datasource-id-2");
    console.log(`Retrieved datasource 2: ${datasource2.id}`);
    
    // Close the session with finalizeWrite=true to ensure any write operations are finalized
    await connector.closeSession(true);
    console.log("Session closed with write finalization");
  } catch (error) {
    console.error("Error:", error);
    await connector.closeSession();
  }
}

// Run the examples
async function runExamples() {
  try {
    await basicSessionExample();
    await automaticSessionExample();
    await directSessionExample();
    await asyncAwaitSessionExample();
  } catch (error) {
    console.error("Error running examples:", error);
  }
}

// Run the examples if this file is executed directly
if (require.main === module) {
  runExamples().catch(console.error);
}
