#!/usr/bin/env node

import { convertToTypeScript } from "./schema-to-typescript.js";
import path from "path";
import { fileURLToPath } from "url";

// ES6 equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EidosInterfaceGenerator {
  constructor() {
    this.schemasUrl = "https://schemas.oceanum.io/eidos";
    this.outputDir = path.resolve(__dirname, "../src/schema");
  }

  async generate() {
    console.log("🚀 Generating TypeScript interfaces from EIDOS schemas...");

    try {
      // Determine the root schema URL
      const rootSchemaPath = `${this.schemasUrl}/root.json`;

      console.log(`📥 Using root schema: ${rootSchemaPath}`);

      // Use our custom schema-to-typescript converter
      await convertToTypeScript(rootSchemaPath);

      console.log("✅ Interface generation completed successfully!");
      console.log(`📄 Generated: ${path.relative(process.cwd(), path.join(this.outputDir, "interfaces.ts"))}`);
    } catch (error) {
      console.error("❌ Error generating interfaces:", error);
      process.exit(1);
    }
  }
}

// Run the generator if this is the main module in ES6
if (
  import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url.endsWith(process.argv[1])
) {
  const generator = new EidosInterfaceGenerator();
  generator.generate().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
