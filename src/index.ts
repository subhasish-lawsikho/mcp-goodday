import { config } from 'dotenv';
import { GoodDayMCPServer } from './mcp-server.js';

// Load environment variables
config();

async function main() {
  try {
    // Validate required environment variables
    const apiKey = process.env.GOODDAY_API_KEY;
    const baseURL = process.env.GOODDAY_API_URL || 'https://api.goodday.work/2.0';

    if (!apiKey) {
      throw new Error('GOODDAY_API_KEY environment variable is required');
    }

    console.log('Starting GoodDay MCP Server...');
    console.log(`API URL: ${baseURL}`);

    // Create and start the MCP server
    const server = new GoodDayMCPServer(apiKey, baseURL);
    await server.run();

  } catch (error) {
    console.error('Failed to start GoodDay MCP Server:', error);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 