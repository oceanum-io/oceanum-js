#!/usr/bin/env node

import crypto from "crypto";
import https from "https";
import fs from "fs";

/**
 * Schema bundler for EIDOS schemas
 * 
 * Key objectives:
 * - Bundle: Combine a root schema and all its referenced external schemas into a single file
 * - Deduplicate: Each unique definition appears only once in the final $defs section
 * - Generate Keys: Create unique PascalCase keys derived from title/filename + path hash for uniqueness
 * - Rewrite Refs: Update all $ref pointers to use the new canonical $defs keys
 * - Exclude Vega: Replace Vega/Vega-Lite schemas with simple PlotSpec placeholder
 */

class SchemaBundler {
  constructor() {
    this.definitions = new Map(); // newKey -> definition
    this.keyMapping = new Map(); // original ref -> new key
    this.seenKeys = new Set(); // track used keys to avoid collisions
    this.definitionHashes = new Map(); // hash -> key for deduplication by content
  }

  /**
   * Generate a hash for a definition to check for duplicates
   * @param {Object} definition - The schema definition
   * @returns {string} - Hash of the definition
   */
  hashDefinition(definition) {
    // Create a stable hash by stringifying the definition in a consistent way
    return crypto.createHash('md5').update(JSON.stringify(definition, Object.keys(definition).sort())).digest('hex');
  }

  /**
   * Generate a unique PascalCase key for a definition, with proper deduplication
   * @param {string} originalKey - The original definition key
   * @param {Object} definition - The schema definition
   * @param {string} path - The path where this definition was found
   * @returns {string} - Unique PascalCase key or existing key if duplicate
   */
  generateKey(originalKey, definition, path) {
    // First check if we've already seen this exact definition
    const defHash = this.hashDefinition(definition);
    if (this.definitionHashes.has(defHash)) {
      // This is a duplicate definition, return the existing key
      return this.definitionHashes.get(defHash);
    }

    let baseName = '';
    
    // First try to get the title from the definition
    if (definition && definition.title) {
      baseName = definition.title;
    } else {
      // Use the original key as fallback
      baseName = originalKey;
    }

    // Convert to PascalCase
    let pascalCase = baseName
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');

    // Ensure it starts with a letter
    if (!/^[A-Z]/.test(pascalCase)) {
      pascalCase = 'Schema' + pascalCase;
    }

    // Only add hash if we have a key name conflict (different definition, same name)
    if (this.seenKeys.has(pascalCase)) {
      const pathHash = crypto.createHash('md5').update(path).digest('hex').substring(0, 8);
      pascalCase = `${pascalCase}${pathHash.charAt(0).toUpperCase()}${pathHash.slice(1)}`;
    }

    this.seenKeys.add(pascalCase);
    this.definitionHashes.set(defHash, pascalCase);
    return pascalCase;
  }

  /**
   * Check if a reference is related to Vega/Vega-Lite
   * @param {string} ref - Reference string
   * @returns {boolean}
   */
  isVegaSchema(ref) {
    if (typeof ref !== 'string') {
      return false;
    }
    
    const lower = ref.toLowerCase();
    return lower.includes('vega-lite') || 
           lower.includes('vega/') || 
           lower.includes('vega.json') || 
           lower.includes('vega-schema') ||
           lower.includes('vega-lite-schema') ||
           lower.includes('/vega') ||
           lower.includes('vegaspec') ||
           lower.includes('spec') && lower.includes('vega');
  }

  /**
   * Create a placeholder for Vega schemas
   * @returns {Object} - PlotSpec placeholder definition
   */
  createVegaPlaceholder() {
    return {
      type: 'object',
      title: 'PlotSpec',
      description: 'Placeholder for Vega/Vega-Lite plot specifications',
      properties: {
        $schema: {
          type: 'string',
          description: 'The Vega/Vega-Lite schema URL'
        },
        data: {
          type: 'object',
          description: 'The data specification'
        },
        mark: {
          type: ['string', 'object'],
          description: 'The mark type or definition'
        },
        encoding: {
          type: 'object',
          description: 'The encoding specification'
        },
        config: {
          type: 'object',
          description: 'The configuration options'
        }
      },
      additionalProperties: true
    };
  }

  /**
   * Check if we should recurse into a definition based on its path/context
   * @param {string} path - Definition path
   * @param {string} key - Definition key
   * @returns {boolean}
   */
  shouldRecurseIntoDefinition(path, key) {
    // Don't recurse into Vega schemas at all
    if (this.isVegaSchema(key) || this.isVegaSchema(path)) {
      return false;
    }
    
    // Only recurse into EIDOS-specific definitions that might contain nested node types
    // This includes paths like /$defs/node which contains the oneOf with World, Plot, etc.
    return true;
  }

  /**
   * Recursively extract all definitions from a schema object
   * @param {Object} obj - Schema object to search
   * @param {Map} collectedDefs - Map to collect definitions
   * @param {string} currentPath - Current path for tracking definition locations
   */
  extractDefinitions(obj, collectedDefs, currentPath = '') {
    if (!obj || typeof obj !== 'object') {
      return;
    }

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        this.extractDefinitions(item, collectedDefs, `${currentPath}[${index}]`);
      });
      return;
    }

    // Check for $defs or definitions at this level
    if (obj.$defs) {
      for (const [key, def] of Object.entries(obj.$defs)) {
        const defPath = `${currentPath}/$defs/${key}`;
        const normalizedKey = decodeURIComponent(key);
        collectedDefs.set(defPath, { 
          definition: def, 
          originalKey: normalizedKey,
          fullPath: defPath 
        });
        
        // Only recursively extract from EIDOS-specific definitions
        if (this.shouldRecurseIntoDefinition(defPath, normalizedKey)) {
          this.extractDefinitions(def, collectedDefs, defPath);
        }
      }
    }

    if (obj.definitions) {
      for (const [key, def] of Object.entries(obj.definitions)) {
        const defPath = `${currentPath}/definitions/${key}`;
        const normalizedKey = decodeURIComponent(key);
        collectedDefs.set(defPath, { 
          definition: def, 
          originalKey: normalizedKey,
          fullPath: defPath 
        });
        
        // Only recursively extract from EIDOS-specific definitions
        if (this.shouldRecurseIntoDefinition(defPath, normalizedKey)) {
          this.extractDefinitions(def, collectedDefs, defPath);
        }
      }
    }

    // Recursively search all properties
    for (const [key, value] of Object.entries(obj)) {
      if (key !== '$defs' && key !== 'definitions') {
        this.extractDefinitions(value, collectedDefs, `${currentPath}/${key}`);
      }
    }
  }

  /**
   * Recursively collect all $refs in an object
   * @param {*} obj - Object to search
   * @param {Set} refs - Set to collect refs into
   */
  collectRefs(obj, refs) {
    if (!obj || typeof obj !== 'object') {
      return;
    }

    if (Array.isArray(obj)) {
      obj.forEach(item => this.collectRefs(item, refs));
      return;
    }

    for (const [key, value] of Object.entries(obj)) {
      if (key === '$ref' && typeof value === 'string') {
        refs.add(decodeURIComponent(value));
      } else {
        this.collectRefs(value, refs);
      }
    }
  }

  /**
   * Rewrite all $ref pointers in a schema to use new keys
   * @param {Object} obj - Object to process
   * @returns {Object} - Processed object with updated refs
   */
  rewriteRefs(obj) {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.rewriteRefs(item));
    }

    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === '$ref' && typeof value === 'string') {
        const normalizedRef = decodeURIComponent(value);
        const newKey = this.keyMapping.get(normalizedRef);
        
        if (newKey) {
          result[key] = `#/$defs/${newKey}`;
        } else {
          // Keep original ref if no mapping found
          result[key] = value;
        }
      } else {
        result[key] = this.rewriteRefs(value);
      }
    }

    return result;
  }

  /**
   * Fetch a schema from URL or file path
   * @param {string} schemaPath - URL or file path
   * @returns {Promise<Object>} - Parsed schema
   */
  async fetchSchema(schemaPath) {
    if (schemaPath.startsWith('http://') || schemaPath.startsWith('https://')) {
      return new Promise((resolve, reject) => {
        https.get(schemaPath, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (err) {
              reject(err);
            }
          });
        }).on('error', reject);
      });
    } else {
      const data = fs.readFileSync(schemaPath, 'utf8');
      return JSON.parse(data);
    }
  }

  /**
   * Recursively collect all external schemas referenced by the root schema
   * @param {Object} schema - Schema to analyze
   * @param {string} baseUrl - Base URL for resolving relative refs
   * @param {Map} schemas - Map to store all loaded schemas
   * @param {Set} visited - Set to track visited URLs to prevent loops
   * @returns {Promise<void>}
   */
  async collectSchemas(schema, baseUrl, schemas, visited = new Set()) {
    if (!schema || typeof schema !== 'object') {
      return;
    }

    if (Array.isArray(schema)) {
      for (const item of schema) {
        await this.collectSchemas(item, baseUrl, schemas, visited);
      }
      return;
    }

    for (const [key, value] of Object.entries(schema)) {
      if (key === '$ref' && typeof value === 'string' && !value.startsWith('#/')) {
        // External reference
        const refUrl = new URL(value, baseUrl).href;
        
        // Skip Vega schemas entirely - don't even fetch them
        if (this.isVegaSchema(refUrl)) {
          console.log(`Skipping Vega schema: ${refUrl}`);
          continue;
        }
        
        if (!visited.has(refUrl) && !schemas.has(refUrl)) {
          visited.add(refUrl);
          try {
            const refSchema = await this.fetchSchema(refUrl);
            schemas.set(refUrl, refSchema);
            // Recursively collect schemas from this schema (but not if it's Vega)
            if (!this.isVegaSchema(refUrl)) {
              await this.collectSchemas(refSchema, refUrl, schemas, visited);
            }
          } catch (err) {
            console.warn(`Failed to fetch ${refUrl}: ${err.message}`);
          }
        }
      } else if (typeof value === 'object') {
        await this.collectSchemas(value, baseUrl, schemas, visited);
      }
    }
  }

  /**
   * Extract a type name from a schema URL
   * @param {string} url - Schema URL
   * @returns {string} - Type name in PascalCase
   */
  extractTypeNameFromUrl(url) {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    if (filename.endsWith('.json')) {
      const typeName = filename.replace('.json', '');
      // Convert to PascalCase
      return typeName.charAt(0).toUpperCase() + typeName.slice(1);
    }
    return 'UnknownType';
  }

  /**
   * Inline external references in a schema and create named definitions for inlined content
   * @param {Object} schema - Schema to process
   * @param {string} baseUrl - Base URL for resolving references
   * @param {Map} allSchemas - Map of all loaded schemas
   * @param {Map} inlinedDefs - Map to collect inlined definitions
   * @param {Set} visited - Set of visited URLs to prevent circular references
   * @returns {Object} - Schema with inlined references
   */
  inlineExternalRefs(schema, baseUrl, allSchemas, inlinedDefs = new Map(), visited = new Set()) {
    if (!schema || typeof schema !== 'object') {
      return schema;
    }

    if (Array.isArray(schema)) {
      return schema.map(item => this.inlineExternalRefs(item, baseUrl, allSchemas, inlinedDefs, visited));
    }

    const result = {};
    for (const [key, value] of Object.entries(schema)) {
      if (key === '$ref' && typeof value === 'string' && !value.startsWith('#/')) {
        // External reference - replace with actual schema content
        const refUrl = new URL(value, baseUrl).href;
        
        // Skip Vega schemas - replace with PlotSpec placeholder
        if (this.isVegaSchema(refUrl)) {
          return this.createVegaPlaceholder();
        }
        
        // Prevent circular references
        if (visited.has(refUrl)) {
          console.warn(`Warning: Circular reference detected: ${refUrl}`);
          // Create a reference to the type name instead
          const typeName = this.extractTypeNameFromUrl(refUrl);
          return { $ref: `#/$defs/${typeName}` };
        }
        
        if (allSchemas.has(refUrl)) {
          const referencedSchema = allSchemas.get(refUrl);
          const typeName = this.extractTypeNameFromUrl(refUrl);
          
          // Store the inlined definition with the type name
          if (!inlinedDefs.has(typeName)) {
            const newVisited = new Set(visited);
            newVisited.add(refUrl);
            const inlinedContent = this.inlineExternalRefs(referencedSchema, refUrl, allSchemas, inlinedDefs, newVisited);
            inlinedDefs.set(typeName, inlinedContent);
          }
          
          // Return a reference to the newly created definition
          return { $ref: `#/$defs/${typeName}` };
        } else {
          console.warn(`Warning: External reference not found: ${refUrl}`);
          // Keep the reference as-is if we can't resolve it
          result[key] = value;
        }
      } else {
        result[key] = this.inlineExternalRefs(value, baseUrl, allSchemas, inlinedDefs, visited);
      }
    }

    return result;
  }

  /**
   * Bundle a schema from a root schema URL/path
   * @param {string} rootSchemaPath - Path or URL to the root schema
   * @returns {Promise<Object>} - Bundled schema
   */
  async bundle(rootSchemaPath) {
    console.log(`📦 Starting schema bundling from: ${rootSchemaPath}`);

    try {
      // First, load the root schema and collect all external schemas
      console.log('📥 Loading root schema and collecting external references...');
      const rootSchema = await this.fetchSchema(rootSchemaPath);
      const baseUrl = rootSchemaPath.startsWith('http') ? rootSchemaPath : new URL(rootSchemaPath, import.meta.url).href;
      
      const allSchemas = new Map();
      allSchemas.set(baseUrl, rootSchema);
      await this.collectSchemas(rootSchema, baseUrl, allSchemas);

      console.log(`Collected ${allSchemas.size} schemas`);

      // Inline all external references into the root schema
      console.log('🔄 Inlining external references...');
      const inlinedDefs = new Map();
      const inlinedSchema = this.inlineExternalRefs(rootSchema, baseUrl, allSchemas, inlinedDefs);

      // Extract ALL definitions from all schemas (original approach)
      console.log('🔄 Processing definitions from all schemas...');
      
      const collectedDefs = new Map();
      for (const [schemaUrl, schema] of allSchemas) {
        this.extractDefinitions(schema, collectedDefs, schemaUrl);
      }
      
      // Also add the inlined definitions (World, Plot, Document, etc.) as separate named definitions
      for (const [typeName, typeDef] of inlinedDefs) {
        collectedDefs.set(`/$defs/${typeName}`, {
          definition: typeDef,
          originalKey: typeName,
          fullPath: `/$defs/${typeName}`
        });
      }

      console.log(`Found ${collectedDefs.size} definitions from all schemas + inlined types`);

      // Collect all refs in the inlined schema (we'll rewrite these)
      const allRefs = new Set();
      this.collectRefs(inlinedSchema, allRefs);
      console.log(`Found ${allRefs.size} total references in inlined schema`);

      // Process all definitions and create mappings
      for (const [defPath, { definition, originalKey, fullPath }] of collectedDefs) {
        if (this.isVegaSchema(originalKey)) {
          // Handle Vega schemas with PlotSpec placeholder
          if (!this.definitions.has('PlotSpec')) {
            this.keyMapping.set(`#/$defs/${originalKey}`, 'PlotSpec');
            this.keyMapping.set(`#/definitions/${originalKey}`, 'PlotSpec');
            this.definitions.set('PlotSpec', this.createVegaPlaceholder());
          }
        } else {
          // Generate unique PascalCase key for this definition (handles deduplication)
          const newKey = this.generateKey(originalKey, definition, fullPath);
          
          // Map all possible reference formats for this definition
          this.keyMapping.set(`#/$defs/${originalKey}`, newKey);
          this.keyMapping.set(`#/definitions/${originalKey}`, newKey);
          
          // Only store the definition if it's not already stored (deduplication)
          if (!this.definitions.has(newKey)) {
            this.definitions.set(newKey, definition);
          }
        }
      }

      // Handle any unmapped refs by trying to find their definitions
      for (const ref of allRefs) {
        if (!this.keyMapping.has(ref)) {
          if (this.isVegaSchema(ref)) {
            this.keyMapping.set(ref, 'PlotSpec');
            if (!this.definitions.has('PlotSpec')) {
              this.definitions.set('PlotSpec', this.createVegaPlaceholder());
            }
          } else {
            // Try to find the definition for this ref
            const refParts = ref.split('/');
            const refKey = refParts[refParts.length - 1];
            const cleanRefKey = decodeURIComponent(refKey);
            
            // Look for a matching definition
            let foundDef = null;
            for (const [defPath, { definition, originalKey }] of collectedDefs) {
              if (originalKey === cleanRefKey || decodeURIComponent(originalKey) === cleanRefKey) {
                foundDef = definition;
                break;
              }
            }
            
            if (foundDef) {
              const newKey = this.generateKey(cleanRefKey, foundDef, ref);
              this.keyMapping.set(ref, newKey);
              // Only store if not already stored (deduplication)
              if (!this.definitions.has(newKey)) {
                this.definitions.set(newKey, foundDef);
              }
            }
          }
        }
      }

      console.log(`✅ Created ${this.definitions.size} unique definitions with ${this.keyMapping.size} reference mappings`);

      // Create the final schema with rewritten references
      console.log('🔧 Rewriting references...');
      
      const finalSchema = this.rewriteRefs({
        ...inlinedSchema,
        $defs: undefined, // Remove original $defs  
        definitions: undefined // Remove original definitions
      });

      // Add the new flattened $defs section with PascalCase keys
      finalSchema.$defs = {};
      for (const [key, definition] of this.definitions) {
        finalSchema.$defs[key] = this.rewriteRefs(definition);
      }
      
      // Always ensure PlotSpec placeholder exists
      if (!finalSchema.$defs.PlotSpec) {
        console.log('Adding PlotSpec placeholder definition');
        finalSchema.$defs.PlotSpec = this.createVegaPlaceholder();
      }

      console.log(`✅ Schema bundling completed! Generated ${Object.keys(finalSchema.$defs).length} definitions.`);
      
      return finalSchema;

    } catch (error) {
      console.error('❌ Error during schema bundling:', error);
      throw error;
    }
  }
}

/**
 * Export function for bundling schemas
 * @param {string} rootSchemaPath - Path or URL to the root schema
 * @returns {Promise<Object>} - Bundled schema
 */
export async function bundle(rootSchemaPath) {
  const bundler = new SchemaBundler();
  return await bundler.bundle(rootSchemaPath);
}

// CLI support - run bundler if called directly
if (import.meta.url === `file://${process.argv[1]}` || 
    import.meta.url.endsWith(process.argv[1])) {
  
  const rootSchema = process.argv[2] || 'https://schemas.oceanum.io/eidos/root.json';
  const outputFile = process.argv[3];

  console.log('🚀 Running schema bundler CLI...');
  
  try {
    const result = await bundle(rootSchema);
    
    if (outputFile) {
      const fs = await import('fs');
      fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
      console.log(`📄 Bundled schema written to: ${outputFile}`);
    } else {
      console.log('📄 Bundled schema:');
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('❌ CLI bundling failed:', error);
    process.exit(1);
  }
}