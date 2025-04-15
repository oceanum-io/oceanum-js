/**
 * Example demonstrating how to use sessions with Zarr data loading in the oceanum-js datamesh library
 * 
 * This example shows how session headers are passed to the Zarr client when loading datasets.
 */

import { Connector } from "../../../packages/datamesh/src/lib/connector";

async function zarrSessionExample() {
  console.log("Example: Using sessions with Zarr data loading");
  
  // Create a connector with session support
  const connector = new Connector(
    process.env.DATAMESH_TOKEN,
    {
      sessionDuration: 2 // Session will last for 2 hours
    }
  );
  
  try {
    // Create a session explicitly
    const session = await connector.createSession();
    console.log(`Session created: ${session.id}`);
    
    // Load a datasource that uses Zarr for storage
    // The session headers will be automatically included in all Zarr requests
    const dataset = await connector.loadDatasource("example-zarr-datasource-id");
    
    if (dataset) {
      console.log("Dataset loaded successfully");
      console.log("Dataset dimensions:", dataset.dimensions);
      console.log("Dataset variables:", Object.keys(dataset.variables));
      
      // Access data from the dataset
      // This will use the session headers when making Zarr requests
      const dataframe = await dataset.asDataframe();
      console.log(`Loaded ${dataframe.length} records from dataset`);
    } else {
      console.log("No data found for datasource");
    }
    
    // Close the session when done
    await connector.closeSession();
    console.log("Session closed");
  } catch (error) {
    console.error("Error:", error);
    // Make sure to close the session even if there's an error
    await connector.closeSession();
  }
}

// Example showing how to use a query with session headers
async function queryWithSessionExample() {
  console.log("\nExample: Using sessions with query operations");
  
  // Create a connector with session support
  const connector = new Connector(process.env.DATAMESH_TOKEN);
  
  try {
    // The connector will automatically create a session when needed
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
      console.log("Query executed successfully");
      console.log("Dataset dimensions:", dataset.dimensions);
      
      // Access data from the dataset
      const dataframe = await dataset.asDataframe();
      console.log(`Loaded ${dataframe.length} records from query result`);
    } else {
      console.log("No data found for query");
    }
    
    // Get the current session that was automatically created
    const session = await connector.getSession();
    console.log(`Used session: ${session.id}`);
    
    // Close the session when done
    await connector.closeSession();
    console.log("Session closed");
  } catch (error) {
    console.error("Error:", error);
    await connector.closeSession();
  }
}

// Run the examples
async function runExamples() {
  try {
    await zarrSessionExample();
    await queryWithSessionExample();
  } catch (error) {
    console.error("Error running examples:", error);
  }
}

// Run the examples if this file is executed directly
if (require.main === module) {
  runExamples().catch(console.error);
}
