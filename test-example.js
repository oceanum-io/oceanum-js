// Example usage of the new Valtio-based EIDOS bindings
import { embed } from './lib/index.js';

// Example EIDOS spec
const exampleSpec = {
  id: 'test-app',
  name: 'Test Application',
  root: {
    id: 'root',
    nodeType: 'grid',
    children: []
  },
  data: [],
  transforms: [],
  modalNodes: []
};

// Usage example with validation testing
async function testEmbed() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  
  try {
    // Create EIDOS instance with full AJV schema validation
    const eidos = await embed(container, exampleSpec, (event) => {
      console.log('Received event from renderer:', event);
    });
    
    console.log('EIDOS instance created and validated:', eidos);
    
    // Now you can mutate the spec naturally!
    eidos.name = 'Updated Application Name';
    eidos.root.children.push({
      id: 'new-child',
      nodeType: 'world',
      children: []
    });
    
    console.log('Spec updated via natural object assignment');
    // These changes will automatically be sent as patches to the renderer
    
  } catch (error) {
    console.error('Failed to create EIDOS instance:', error);
    // AJV will provide detailed validation error messages
  }
}

// Test invalid spec to see AJV validation in action
async function testInvalidSpec() {
  const invalidSpec = {
    // Missing required 'id' and 'root' properties
    name: 'Invalid Spec'
  };
  
  try {
    await embed(document.createElement('div'), invalidSpec);
  } catch (error) {
    console.log('Expected validation error:', error.message);
    // Should show detailed AJV validation errors
  }
}

// Uncomment to test:
// testEmbed();