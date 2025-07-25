#!/usr/bin/env node

import { bundle } from "./schema-bundler.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES6 equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Custom TypeScript interface generator for EIDOS schemas
 * 
 * This script takes a bundled schema and converts each root $def to a TypeScript interface.
 * It strips out non-TypeScript relevant fields and uses them for JSDoc documentation.
 * No external dependencies like json-schema-to-typescript.
 */
class SchemaToTypeScript {
  constructor() {
    this.schemasUrl = "https://schemas.oceanum.io/eidos";
    this.outputDir = path.resolve(__dirname, "../src/schema");
    this.outputFile = path.join(this.outputDir, "interfaces.ts");
    this.processedRefs = new Set(); // Track processed references to avoid duplicates
  }

  /**
   * Convert a bundled schema to TypeScript interfaces
   * @param {string} rootSchemaPath - Path or URL to the root schema
   * @returns {Promise<void>}
   */
  async convertToTypeScript(rootSchemaPath) {
    console.log("🚀 Converting EIDOS schemas to TypeScript interfaces...");

    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    try {
      console.log(`📥 Bundling schemas from: ${rootSchemaPath}`);
      
      // Use our custom schema bundler to bundle all schemas into one
      const bundledSchema = await bundle(rootSchemaPath);
      
      console.log("📦 Schema bundling completed successfully!");

      if (!bundledSchema.$defs || Object.keys(bundledSchema.$defs).length === 0) {
        throw new Error("No $defs found in bundled schema");
      }

      console.log(`🔄 Converting ${Object.keys(bundledSchema.$defs).length} definitions to TypeScript interfaces...`);

      const interfaces = [];
      const banner = `/**
 * Auto-generated TypeScript interfaces for EIDOS schemas
 * Generated from: ${rootSchemaPath}
 * 
 * Each interface corresponds to a definition in the EIDOS schema bundle.
 * These interfaces can be used for type validation and IDE support.
 * 
 * Do not modify this file directly - regenerate using:
 * npx nx run eidos:generate-types
 */

`;

      // Convert each definition to a TypeScript interface using custom logic
      for (const [defName, defSchema] of Object.entries(bundledSchema.$defs)) {
        console.log(`  Converting ${defName}...`);
        
        try {
          const interfaceCode = this.generateInterface(defName, defSchema, bundledSchema.$defs);
          interfaces.push(interfaceCode);
        } catch (error) {
          console.warn(`⚠️  Failed to convert ${defName}: ${error.message}`);
          // Create a simple interface as fallback
          interfaces.push(this.generateFallbackInterface(defName, defSchema));
        }
      }

      // Combine all interfaces into a single file
      const finalOutput = banner + interfaces.join('\n\n') + '\n';

      // Write the TypeScript file
      fs.writeFileSync(this.outputFile, finalOutput);

      console.log("✅ TypeScript interface generation completed successfully!");
      console.log(`📄 Generated: ${path.relative(process.cwd(), this.outputFile)}`);
      console.log(`📊 Created ${Object.keys(bundledSchema.$defs).length} TypeScript interfaces`);

    } catch (error) {
      console.error("❌ Error converting schemas to TypeScript:", error);
      throw error;
    }
  }

  /**
   * Generate a TypeScript interface from a schema definition
   * @param {string} name - Interface name
   * @param {Object} schema - Schema definition
   * @param {Object} allDefs - All definitions for reference resolution
   * @returns {string} - Generated TypeScript interface
   */
  generateInterface(name, schema, allDefs) {
    const docs = this.extractDocumentation(schema);
    const properties = this.generateProperties(schema, allDefs);
    
    let result = '';
    
    // Add JSDoc comment from schema metadata
    if (docs.length > 0) {
      result += '/**\n';
      docs.forEach(doc => {
        result += ` * ${doc}\n`;
      });
      result += ' */\n';
    }
    
    // Check if this should be a type alias instead of an interface
    if (schema.oneOf || schema.anyOf || (schema.type && schema.type !== 'object' && !schema.properties)) {
      // Use type alias for union types and primitive types
      const type = this.generateType(schema, allDefs);
      result += `export type ${name} = ${type};`;
    } else if (properties.trim() === '') {
      // Empty interface, make it a type alias to any
      result += `export type ${name} = any;`;
    } else {
      // Use interface for object types with properties
      result += `export interface ${name} {\n`;
      result += properties;
      result += '}';
    }
    
    return result;
  }

  /**
   * Generate fallback interface for schemas that can't be processed
   * @param {string} name - Interface name
   * @param {Object} schema - Schema definition
   * @returns {string} - Simple fallback interface
   */
  generateFallbackInterface(name, schema) {
    const description = schema.description || `${name} interface (fallback)`;
    return `/**
 * ${description}
 */
export interface ${name} {
  [key: string]: any;
}`;
  }

  /**
   * Extract documentation from schema metadata
   * @param {Object} schema - Schema object
   * @returns {string[]} - Array of documentation lines
   */
  extractDocumentation(schema) {
    const docs = [];
    
    if (schema.title && schema.title !== schema.description) {
      docs.push(schema.title);
    }
    
    if (schema.description) {
      docs.push(schema.description);
    }
    
    if (schema.examples && schema.examples.length > 0) {
      docs.push('');
      docs.push('@example');
      schema.examples.slice(0, 3).forEach(example => {
        docs.push(`${JSON.stringify(example)}`);
      });
    }
    
    return docs;
  }

  /**
   * Generate TypeScript properties from schema
   * @param {Object} schema - Schema object
   * @param {Object} allDefs - All definitions for reference resolution
   * @returns {string} - Generated properties string
   */
  generateProperties(schema, allDefs) {
    let result = '';
    
    // Handle union types (oneOf, anyOf) - these should not have properties, just be type aliases
    if (schema.oneOf || schema.anyOf) {
      // For union types, we don't generate properties - the interface will be a type alias
      return '';
    }
    
    // Handle different schema types
    if (schema.$ref) {
      // Reference to another definition
      const refName = this.resolveReference(schema.$ref);
      return `  [key: string]: ${refName};\n`;
    }
    
    if (schema.type === 'object' && schema.properties) {
      // Object with properties
      const required = schema.required || [];
      
      for (const [propName, propSchema] of Object.entries(schema.properties)) {
        const isOptional = !required.includes(propName);
        const propType = this.generateType(propSchema, allDefs);
        const propDocs = this.extractDocumentation(propSchema);
        
        // Add property documentation
        if (propDocs.length > 0) {
          result += '  /**\n';
          propDocs.forEach(doc => {
            result += `   * ${doc}\n`;
          });
          result += '   */\n';
        }
        
        result += `  ${propName}${isOptional ? '?' : ''}: ${propType};\n`;
      }
      
      // Handle additionalProperties
      if (schema.additionalProperties === true) {
        result += '  [key: string]: any;\n';
      } else if (typeof schema.additionalProperties === 'object') {
        const additionalType = this.generateType(schema.additionalProperties, allDefs);
        result += `  [key: string]: ${additionalType};\n`;
      }
    } else if (schema.type && schema.type !== 'object') {
      // For primitive types, this should be a type alias, not an interface
      return '';
    } else {
      // For schemas without clear structure, fallback to index signature
      const type = this.generateType(schema, allDefs);
      result += `  [key: string]: ${type};\n`;
    }
    
    return result;
  }

  /**
   * Generate TypeScript type from schema
   * @param {Object} schema - Schema object
   * @param {Object} allDefs - All definitions for reference resolution
   * @returns {string} - Generated TypeScript type
   */
  generateType(schema, allDefs) {
    if (!schema || typeof schema !== 'object') {
      return 'any';
    }
    
    // Handle $ref
    if (schema.$ref) {
      return this.resolveReference(schema.$ref);
    }
    
    // Handle union types (oneOf, anyOf)
    if (schema.oneOf || schema.anyOf) {
      const options = schema.oneOf || schema.anyOf;
      const types = options.map(option => {
        // For references, resolve them directly
        if (option.$ref) {
          // For external references (not starting with #/), try to extract type name from URL
          if (!option.$ref.startsWith('#/')) {
            // Extract the type name from the URL
            const urlParts = option.$ref.split('/');
            const filename = urlParts[urlParts.length - 1];
            if (filename.endsWith('.json')) {
              const typeName = filename.replace('.json', '');
              // Convert to PascalCase
              return typeName.charAt(0).toUpperCase() + typeName.slice(1);
            }
          }
          return this.resolveReference(option.$ref);
        }
        
        // Handle specific object types with titles that are already defined in allDefs
        if (option.title && option.type === 'object') {
          // Check if this matches a definition we have
          const matchingDefKey = Object.keys(allDefs).find(key => {
            return allDefs[key].title === option.title;
          });
          
          if (matchingDefKey) {
            return matchingDefKey;
          }
        }
        
        // Generate the type for this option
        return this.generateType(option, allDefs);
      });
      
      // Filter out duplicates and empty types
      const uniqueTypes = [...new Set(types)].filter(type => type && type !== 'any');
      
      // If we have no valid types, return any
      if (uniqueTypes.length === 0) {
        return 'any';
      }
      
      // Format the union with proper spacing
      return uniqueTypes.join(' | ');
    }
    
    // Handle allOf (intersection)
    if (schema.allOf) {
      const types = schema.allOf.map(option => this.generateType(option, allDefs));
      return types.join(' & ');
    }
    
    // Handle arrays
    if (schema.type === 'array') {
      if (schema.items) {
        const itemType = this.generateType(schema.items, allDefs);
        return `${itemType}[]`;
      }
      return 'any[]';
    }
    
    // Handle primitives
    switch (schema.type) {
      case 'string':
        if (schema.enum) {
          return schema.enum.map(val => `"${val}"`).join(' | ');
        }
        return 'string';
      case 'number':
      case 'integer':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'null':
        return 'null';
      case 'object':
        // For inline object schemas, try to extract a meaningful type name
        if (schema.title) {
          return schema.title;
        }
        return 'object';
      default:
        return 'any';
    }
  }

  /**
   * Resolve a $ref to a TypeScript type name
   * @param {string} ref - Reference string
   * @returns {string} - TypeScript type name
   */
  resolveReference(ref) {
    if (ref.startsWith('#/$defs/')) {
      return ref.replace('#/$defs/', '');
    }
    if (ref.startsWith('#/definitions/')) {
      return ref.replace('#/definitions/', '');
    }
    // For unresolved refs, return any
    return 'any';
  }
}

/**
 * Export function for converting schemas to TypeScript
 * @param {string} rootSchemaPath - Path or URL to the root schema
 * @returns {Promise<void>}
 */
export async function convertToTypeScript(rootSchemaPath) {
  const converter = new SchemaToTypeScript();
  return await converter.convertToTypeScript(rootSchemaPath);
}

// CLI support - run converter if called directly
if (import.meta.url === `file://${process.argv[1]}` || 
    import.meta.url.endsWith(process.argv[1])) {
  
  const rootSchema = process.argv[2] || 'https://schemas.oceanum.io/eidos/root.json';
  
  console.log('🚀 Running schema to TypeScript converter CLI...');
  
  try {
    await convertToTypeScript(rootSchema);
    console.log('✅ Schema to TypeScript conversion completed successfully!');
  } catch (error) {
    console.error('❌ CLI conversion failed:', error);
    process.exit(1);
  }
}