// Jest setup file
import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

// Global test setup
beforeAll(() => {
  // Set up any global test configuration
  console.log('Setting up test environment...');
});

afterAll(() => {
  // Clean up any global test resources
  console.log('Cleaning up test environment...');
}); 