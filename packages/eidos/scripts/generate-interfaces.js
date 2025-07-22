#!/usr/bin/env node

import $RefParser from '@apidevtools/json-schema-ref-parser';
import fs from 'fs';
import { compile } from 'json-schema-to-typescript';
import path from 'path';
import { fileURLToPath } from 'url';

// ES6 equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EidosInterfaceGenerator {
  constructor() {
    this.schemasUrl = 'https://schemas.oceanum.io/eidos';
    this.localSchemasPath = path.resolve(
      __dirname,
      '../../../packages/eidos/schemas',
    );
    this.outputDir = path.resolve(__dirname, '../src/schema');
    this.outputFile = path.join(this.outputDir, 'index.ts');
    this.isLocalMode = fs.existsSync(this.localSchemasPath);
  }

  async generate() {
    console.log('🚀 Generating TypeScript interfaces from Eidos schemas...');
    console.log(
      `📂 Mode: ${this.isLocalMode ? 'Local schemas' : 'Remote schemas'}`,
    );

    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    try {
      // Determine the root schema URL or path
      const rootSchemaPath = this.isLocalMode
        ? path.join(this.localSchemasPath, 'root.json')
        : `${this.schemasUrl}/root.json`;

      console.log(`📥 Bundling schemas from: ${rootSchemaPath}`);

      // Use json-schema-ref-parser to bundle all schemas into one
      const bundledSchema = await $RefParser.dereference(rootSchemaPath, {
        unreachableDefinitions: true,
      });

      console.log('📦 Schema bundling completed successfully!');

      // Generate TypeScript interfaces from the bundled schema
      console.log('🔄 Generating TypeScript interfaces...');
      const typescript = await compile(bundledSchema, 'EidosSchema', {
        bannerComment: `/**
 * Auto-generated TypeScript interfaces for Eidos schemas
 * Generated from: ${rootSchemaPath}
 * Do not modify this file directly.
 */`,
        style: {
          bracketSpacing: true,
          printWidth: 120,
          semi: true,
          singleQuote: true,
          tabWidth: 2,
          trailingComma: 'es5',
          useTabs: false,
        },
        additionalProperties: false,
        enableConstEnums: true,
        format: true,
        ignoreMinAndMaxItems: false,
        maxItems: 20,
        strictIndexSignatures: false,
        unknownAny: true,
        unreachableDefinitions: false,
      });

      // Write the TypeScript file
      fs.writeFileSync(this.outputFile, typescript);

      console.log('✅ Interface generation completed successfully!');
      console.log(
        `📄 Generated: ${path.relative(process.cwd(), this.outputFile)}`,
      );
    } catch (error) {
      console.error('❌ Error generating interfaces:', error);
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
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
