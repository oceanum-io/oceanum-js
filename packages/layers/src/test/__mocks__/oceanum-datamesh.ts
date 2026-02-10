/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock @oceanum/datamesh for testing (module alias in vite.config.ts)
export class Dataset {
  dimensions: Record<string, any>;
  variables: Record<string, any>;
  attributes: Record<string, any>;
  coordkeys: Record<string, any>;
  root: any;

  constructor(
    dimensions: Record<string, any>,
    variables: Record<string, any>,
    attributes: Record<string, any>,
    coordkeys: Record<string, any>,
    root: any,
  ) {
    this.dimensions = dimensions;
    this.variables = variables;
    this.attributes = attributes;
    this.coordkeys = coordkeys;
    this.root = root;
  }

  static async zarr(): Promise<Dataset> {
    return new Dataset({}, {}, {}, {}, null);
  }
}
