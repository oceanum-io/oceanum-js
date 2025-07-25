#!/usr/bin/env node

import { bundle } from "./schema-bundler.js";

async function debugSchema() {
  try {
    const schema = await bundle('https://schemas.oceanum.io/eidos/root.json');
    console.log("Node definition:");
    console.log(JSON.stringify(schema.$defs.Node, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

debugSchema();
