# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OceanumJs is a TypeScript/JavaScript library for interacting with the Oceanum.io platform. It's organized as an Nx monorepo with two main packages:

- **@oceanum/datamesh** - Library for interacting with the Oceanum.io Datamesh API, providing data query capabilities with session management
- **@oceanum/eidos** - Reactive JavaScript bindings for embedding and controlling EIDOS visualizations using Valtio for state management and AJV for schema validation

## Development Commands

### Building

```bash
# Build all packages
npx nx run-many -t build

# Build specific package
npx nx build datamesh
npx nx build eidos
```

### Testing

```bash
# Run tests for datamesh (only package with tests)
npx nx test datamesh

# Run tests with coverage
npx nx test datamesh --coverage
```

### Linting and Type Checking

```bash
# Lint all projects
npx nx run-many -t lint

# Lint specific package
npx nx lint datamesh
npx nx lint eidos

# Type checking is handled by Nx TypeScript plugin
npx nx typecheck datamesh
npx nx typecheck eidos
```

### Documentation

```bash
# Generate TypeDoc documentation
npm run docs

# Serve docs with watch mode
npm run docs:serve

# Generate docs for specific package
npx nx build-docs datamesh
```

### EIDOS Development

```bash
# Development server for EIDOS
npx nx dev eidos

# Generate TypeScript interfaces from schema
npx nx run eidos:generate-types
```

## Architecture

### Datamesh Package (`packages/datamesh/`)

- **Connector class**: Main entry point for datamesh operations, handles authentication and session management
- **Session management**: Supports resource allocation and authentication for datamesh operations
- **Query system**: Flexible query interface for data retrieval with filtering and aggregation
- **Data models**: Dataset, DataVar classes for working with scientific data
- **Zarr support**: Integration with Zarrita for chunked array data storage

Key files:

- `src/lib/connector.ts` - Main Connector class and API
- `src/lib/session.ts` - Session management functionality
- `src/lib/query.ts` - Query building and execution
- `src/lib/datamodel.ts` - Data representation classes

### EIDOS Package (`packages/eidos/`)

- **Reactive state management**: Uses Valtio proxy for natural object mutations
- **Schema validation**: AJV-based validation against EIDOS schemas
- **Iframe communication**: Message passing between host and renderer
- **Framework agnostic**: Designed to work with React, Vue, Svelte, and vanilla JS

Key files:

- `src/index.ts` - Main render function and iframe setup
- `src/eidosmodel.ts` - Schema validation using AJV
- `scripts/generate-interfaces.js` - TypeScript interface generation
- `scripts/schema-bundler.js` - Schema processing utilities

#### Automated typecript interface generation

This uses script `scripts/generate-interfaces.js` to generate TypeScript interfaces from the bundled schema. The script is run as part of the build process in `package.json`.

There is helper script `scripts/schema-bundler.js` that is used to bundle the schemas with these key objectives:

- Bundle: Combine a root schema and all its referenced external schemas into a single, self-contained file.
- Deduplicate: The core requirement is to ensure that each unique definition appears only once in the final $defs section, even if it's referenced from multiple locations.
- Generate Keys: Create a unique and stable PascalCase key for each definition. This key should be derived from the definition's title (or filename as a fallback) and combined with a hash of its canonical path to guarantee uniqueness and prevent any collisions.
- Rewrite Refs: Systematically update all $ref pointers throughout the entire schema to use the new, canonical $defs keys.
- Exclude Vega: Special-case the Vega and Vega-Lite schemas by replacing them with a simple placeholder definition called `PlotSpec` rather than bundling them fully.

There is also a helper script `scripts/schema-to-typescript.js` that is used to generate TypeScript interfaces from the bundled schema. This should create a set of TypeScript interfaces that can be used to validate EIDOS schemas. Each root $def should be converted to a TypeScript interface.

## Testing

Tests are primarily located in the datamesh package (`packages/datamesh/src/test/`). The project uses Vitest as the test runner configured through `vitest.workspace.ts`.

## Security Notes

- Datamesh tokens should never be exposed in browser code - use reverse proxy for SPAs
- EIDOS renderer defaults to `https://render.eidos.oceanum.io` but can be configured
- Schema validation is enforced for EIDOS specs before rendering
