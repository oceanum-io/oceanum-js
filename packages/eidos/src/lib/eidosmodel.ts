import Ajv, { ValidateFunction } from "ajv";

const ROOT_SCHEMA = "https://schemas.oceanum.io/eidos/root.json";
let validator: ValidateFunction | null = null;

const loadSchema = async (uri: string) => {
  const res = await fetch(uri);
  // fetch Responses expose `status`/`ok`, not `statusCode` — the old check
  // never fired. Returning `res.body` (a ReadableStream) handed ajv a
  // non-schema, silently compiling an accept-everything validator.
  if (!res.ok) throw new Error("Loading error: " + res.status);
  return res.json();
};

const validateSchema = async (spec: any): Promise<boolean> => {
  if (!validator) {
    //Load the root schema from URL as JSON
    const schema = await loadSchema(ROOT_SCHEMA);

    // Create AJV instance with configuration
    const ajv = new Ajv({
      allErrors: true,
      verbose: true,
      strict: false, // Allow additional properties for flexibility
      loadSchema,
    });

    // Compile the validator
    validator = await ajv.compileAsync(schema);
  }

  const isValid = validator(spec);

  if (!isValid && validator.errors) {
    const errorMessages = validator.errors
      .map(
        (error: any) =>
          `${error.instancePath || "root"}: ${error.message} (${JSON.stringify(error.params || {})})`
      )
      .join("; ");

    throw new Error(`EIDOS spec validation failed: ${errorMessages}`);
  }

  return true;
};

export { validateSchema };
