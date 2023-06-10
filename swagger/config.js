import fs from 'fs';
import YAML from 'yaml';
import swaggerJsdoc from 'swagger-jsdoc';

// ℹ️ --- Swagger docs ---

// Load the Swagger specifications from the YAML files
const memorySpec = YAML.parse(fs.readFileSync('./swagger/memory.yaml', 'utf8'));
const testSpec = YAML.parse(fs.readFileSync('./swagger/test.yaml', 'utf8'));

// Combine the specifications
const combinedSpec = {
  ...memorySpec,
  ...testSpec,
  paths: {
    ...memorySpec.paths,
    // Add more specifications if needed here
    ...testSpec.paths, // test is for the example purpose
  },
};

// Swagger options
const options = {
  swaggerDefinition: combinedSpec,
  apis: ['./routes/*.js'], // Add your API files here
};

// Initialize swagger-jsdoc
const swaggerSpecs = swaggerJsdoc(options);

export default swaggerSpecs;
