#!/usr/bin/env node

import { bundle } from "./schema-bundler.js";

async function debugSchema() {
  try {
    const schema = await bundle('https://schemas.oceanum.io/eidos/root.json');
    
    // Log all $defs keys to check what's available
    console.log("All $defs keys:");
    console.log(Object.keys(schema.$defs));
    
    // Check for PlotSpec specifically
    console.log("\nPlotSpec exists:", schema.$defs.hasOwnProperty("PlotSpec"));
    if (schema.$defs.PlotSpec) {
      console.log("PlotSpec definition:");
      console.log(JSON.stringify(schema.$defs.PlotSpec, null, 2));
    }
    
    // Check for the root schema
    console.log("\nRoot schema properties:");
    const { $defs, ...rootSchema } = schema;
    console.log(Object.keys(rootSchema));
    console.log(JSON.stringify(rootSchema, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

debugSchema();
