# GoodDay MCP Server

A Model Context Protocol (MCP) server for integrating with the GoodDay project management API. This server provides tools to list projects, users, create and update tasks in GoodDay through a standardized MCP interface.

## Requirements
Node version : 18+

## Features

- **Project Management**: List all projects and get project details
- **User Management**: List all users and get user details  
- **Task Management**: Create, read, update, and delete tasks
- **Health Monitoring**: Check API connection status
- **Type Safety**: Full TypeScript implementation with Zod validation
- **Error Handling**: Comprehensive error handling and logging
- **Security**: Secure API key management

## Prerequisites

- Node.js 18+ 
- GoodDay API key

## Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd goodday-mcp
npm install
npm run build

```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd goodday-mcp
```

2. Install dependencies:
```bash
npm install
```

## Configuration

1. Copy the environment template:
```bash
cp env.example .env
```

2. Edit `.env` file with your GoodDay API credentials:
```env
# GoodDay API Configuration
GOODDAY_API_URL=https://api.goodday.work/2.0
GOODDAY_API_KEY=your_api_key_here

# MCP Server Configuration
MCP_SERVER_PORT=3000
MCP_SERVER_HOST=localhost

# Logging
LOG_LEVEL=info
```

## Usage

### Starting the Server

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

### MCP Client Configuration

Add the following to your MCP client configuration:

```json
{
  "mcpServers": {
    "goodday": {
          "command": "node",
          "args": [
            "D:\\work\\goodday-mcp\\dist\\index.js"
          ],
          "env": {
            "GOODDAY_API_KEY": "GOODDAY_API_KEY",
            "GOODDAY_API_URL": "https://api.goodday.work/2.0"
          }
    }  
  }
}
```

**Important Notes:**
- Replace `D:\\work\\goodday-mcp` with your actual project path
- Update the API credentials with your real GoodDay API key
- The `cwd` (working directory) is required for proper MCP server initialization

## Available Tools

### 1. List Projects
- **Tool**: `list_goodday_projects`
- **Description**: List all GoodDay projects in the organization
- **Parameters**: None
- **Returns**: List of projects with details

### 2. List Users
- **Tool**: `list_goodday_users`
- **Description**: List all users in the GoodDay organization
- **Parameters**: None
- **Returns**: List of users with details

### 3. Get Project Details
- **Tool**: `get_goodday_project`
- **Description**: Get details of a specific GoodDay project
- **Parameters**: 
  - `project_id` (string, required): The ID of the project
- **Returns**: Project details

### 4. Get User Details
- **Tool**: `get_goodday_user`
- **Description**: Get details of a specific GoodDay user
- **Parameters**:
  - `user_id` (string, required): The ID of the user
- **Returns**: User details

### 5. List Tasks
- **Tool**: `list_goodday_tasks`
- **Description**: List all tasks, optionally filtered by project
- **Parameters**:
  - `project_id` (string, optional): Filter tasks by project ID
  - `project_name` (string, optional): Filter tasks by project name (will be converted to project_id automatically)
- **Returns**: List of tasks with details

### 6. Get Task Details
- **Tool**: `get_goodday_task`
- **Description**: Get details of a specific GoodDay task
- **Parameters**:
  - `task_id` (string, required): The ID of the task
- **Returns**: Task details

### 7. Create Task
- **Tool**: `create_goodday_task`
- **Description**: Create a new task in GoodDay
- **Parameters**:
  - `title` (string, required): Title of the task
  - `description` (string, optional): Description of the task
  - `project_id` (string, optional): ID of the project (optional if project_name is provided)
  - `project_name` (string, optional): Name of the project (will be converted to project_id automatically)
  - `assignee_id` (string, optional): ID of the assignee
  - `priority` (string, optional): Priority level (low, normal, high, urgent)
  - `due_date` (string, optional): Due date (YYYY-MM-DD format)
  - `estimated_hours` (number, optional): Estimated hours
  - `tags` (array, optional): Array of tags (not supported by GoodDay API)
- **Returns**: Created task details

## User-Friendly Features

### Project Name Lookup
Instead of remembering complex project IDs, you can now use project names for easier task management:

**Example Usage:**
```bash
# Using project name (recommended)
@goodday create_goodday_task
title: "Create landing page"
project_name: "MyProject"
priority: "high"
due_date: "2025-01-15"

# Using project ID (still supported)
@goodday create_goodday_task
title: "Create landing page"
project_id: "proj-123"
priority: "high"
```
### 8. Update Task
- **Tool**: `update_goodday_task`
- **Description**: Update an existing GoodDay task
- **Parameters**:
  - `task_id` (string, required): ID of the task to update
  - `title` (string, optional): New title
  - `description` (string, optional): New description
  - `status` (string, optional): New status
  - `priority` (string, optional): New priority
  - `assignee_id` (string, optional): New assignee ID
  - `due_date` (string, optional): New due date
  - `estimated_hours` (number, optional): New estimated hours
  - `progress` (number, optional): Progress percentage (0-100)
  - `tags` (array, optional): New tags array (not supported by GoodDay API)
- **Returns**: Updated task details

### 9. Delete Task
- **Tool**: `delete_goodday_task`
- **Description**: Delete a GoodDay task
- **Parameters**:
  - `task_id` (string, required): ID of the task to delete
- **Returns**: Confirmation message

### 10. Health Check
- **Tool**: `goodday_health_check`
- **Description**: Check the health status of the GoodDay API connection
- **Parameters**: None
- **Returns**: Health status

## Development

### Project Structure

```
src/
├── index.ts              # Main entry point
├── mcp-server.ts         # MCP server implementation
├── services/
│   └── goodday-api.ts   # GoodDay API service
├── types/
│   └── goodday.ts        # TypeScript type definitions
└── __tests__/
    ├── goodday-api.test.ts  # Unit tests
    └── setup.ts             # Test configuration

# Configuration files
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── jest.config.js        # Test configuration
├── env.example           # Environment template
├── mcp-config.json      # MCP client configuration
```

### Cursor Configuration

For Cursor IDE integration, add the following to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "goodday": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "D:\\work\\goodday-mcp",
      "env": {
        "GOODDAY_API_KEY": "your_api_key_here",
        "GOODDAY_API_URL": "https://api.goodday.work/2.0"
      }
    }
  }
}
```

### Usage in Cursor
After configuration, you can use the GoodDay tools in Cursor:

- `@goodday list_goodday_projects` - List all projects
- `@goodday list_goodday_users` - List all users
- `@goodday create_goodday_task` - Create a new task
- `@goodday goodday_health_check` - Check API health

### Troubleshooting MCP Issues
If you see "no tools or prompts":
1. Verify the `cwd` path is correct
2. Ensure the server builds successfully: `npm run build`
3. Test manually: `node dist/index.js`
4. Restart Cursor after configuration changes
5. Check that API credentials are valid

## API Limitations

### Supported Fields
- ✅ **Title** - Required field
- ✅ **Description** - Uses GoodDay's `message` field
- ✅ **Priority** - low, normal, high, urgent
- ✅ **Due Date** - YYYY-MM-DD format
- ✅ **Estimated Hours** - Automatically converted to minutes
- ✅ **Assignee** - User ID assignment
- ✅ **Project** - Name or ID lookup

### Known Limitations
- ⚠️ **Tags** - Not supported by the GoodDay API
- ⚠️ **Custom Fields** - Limited support
- ⚠️ **Attachments** - Not supported via API
- ⚠️ **Comments** - Not supported via API

## License
MIT License - see LICENSE file for details

