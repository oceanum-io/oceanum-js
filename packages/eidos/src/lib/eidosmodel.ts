import $RefParser from '@apidevtools/json-schema-ref-parser';
import Ajv, { ValidateFunction } from 'ajv';

const ROOT_SCHEMA = 'https://schemas.oceanum.io/eidos/root.json';
let validator: ValidateFunction | null = null;

const validateSchema = async (spec: any): Promise<boolean> => {
  if (!validator) {
    // Dereference the schema to resolve all $refs
    const schema = await $RefParser.dereference(ROOT_SCHEMA, {
      continueOnError: false,
    }) as any;
    
    // Create AJV instance with configuration
    const ajv = new Ajv({ 
      allErrors: true,
      verbose: true,
      strict: false // Allow additional properties for flexibility
    });
    
    // Compile the validator
    validator = ajv.compile(schema);
  }
  
  const isValid = validator(spec);
  
  if (!isValid && validator.errors) {
    const errorMessages = validator.errors.map((error: any) => 
      `${error.instancePath || 'root'}: ${error.message} (${JSON.stringify(error.params || {})})`
    ).join('; ');
    
    throw new Error(`EIDOS spec validation failed: ${errorMessages}`);
  }
  
  return true;
};

export { validateSchema };