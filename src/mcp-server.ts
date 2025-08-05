import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema,
  Tool 
} from '@modelcontextprotocol/sdk/types.js';
import { GoodDayApiService } from './services/goodday-api.js';
import { 
  GoodDayTaskCreate, 
  GoodDayTaskUpdate,
  GoodDayTaskCreateSchema,
  GoodDayTaskUpdateSchema
} from './types/goodday.js';
import { z } from 'zod';

// MCP Server implementation for GoodDay API
export class GoodDayMCPServer {
  private server: Server;
  private goodDayService: GoodDayApiService;

  constructor(apiKey: string, baseURL?: string) {
    this.goodDayService = new GoodDayApiService(apiKey, baseURL);
    
    this.server = new Server(
      {
        name: 'goodday-mcp-server',
        version: '1.0.0'
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // List all GoodDay projects
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'list_goodday_projects',
            description: 'List all GoodDay projects in the organization',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          },
          {
            name: 'list_goodday_users',
            description: 'List all users in the GoodDay organization',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          },
          {
            name: 'get_goodday_project',
            description: 'Get details of a specific GoodDay project by ID',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  description: 'The ID of the project to retrieve'
                }
              },
              required: ['project_id']
            }
          },
          {
            name: 'get_goodday_user',
            description: 'Get details of a specific GoodDay user by ID',
            inputSchema: {
              type: 'object',
              properties: {
                user_id: {
                  type: 'string',
                  description: 'The ID of the user to retrieve'
                }
              },
              required: ['user_id']
            }
          },
          {
            name: 'list_goodday_tasks',
            description: 'List all tasks in GoodDay, optionally filtered by project',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  description: 'Optional project ID to filter tasks by project'
                },
                project_name: {
                  type: 'string',
                  description: 'Optional project name to filter tasks by project (will be converted to project_id automatically)'
                }
              },
              required: []
            }
          },
          {
            name: 'get_goodday_task',
            description: 'Get details of a specific GoodDay task by ID',
            inputSchema: {
              type: 'object',
              properties: {
                task_id: {
                  type: 'string',
                  description: 'The ID of the task to retrieve'
                }
              },
              required: ['task_id']
            }
          },
          {
            name: 'create_goodday_task',
            description: 'Create a new task in GoodDay',
            inputSchema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'Title of the task'
                },
                description: {
                  type: 'string',
                  description: 'Description of the task'
                },
                project_id: {
                  type: 'string',
                  description: 'ID of the project to create the task in (optional if project_name is provided)'
                },
                project_name: {
                  type: 'string',
                  description: 'Name of the project to create the task in (will be converted to project_id automatically)'
                },
                assignee_id: {
                  type: 'string',
                  description: 'ID of the user to assign the task to'
                },
                priority: {
                  type: 'string',
                  enum: ['low', 'normal', 'high', 'urgent'],
                  description: 'Priority level of the task'
                },
                due_date: {
                  type: 'string',
                  description: 'Due date for the task (YYYY-MM-DD format)'
                },
                estimated_hours: {
                  type: 'number',
                  description: 'Estimated hours for the task'
                },
                tags: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Array of tags for the task'
                }
              },
              required: ['title']
            }
          },
          {
            name: 'update_goodday_task',
            description: 'Update an existing GoodDay task',
            inputSchema: {
              type: 'object',
              properties: {
                task_id: {
                  type: 'string',
                  description: 'ID of the task to update'
                },
                title: {
                  type: 'string',
                  description: 'New title for the task'
                },
                description: {
                  type: 'string',
                  description: 'New description for the task'
                },
                status: {
                  type: 'string',
                  description: 'New status for the task'
                },
                priority: {
                  type: 'string',
                  enum: ['low', 'normal', 'high', 'urgent'],
                  description: 'New priority level for the task'
                },
                assignee_id: {
                  type: 'string',
                  description: 'ID of the new assignee for the task'
                },
                due_date: {
                  type: 'string',
                  description: 'New due date for the task (YYYY-MM-DD format)'
                },
                estimated_hours: {
                  type: 'number',
                  description: 'New estimated hours for the task'
                },
                progress: {
                  type: 'number',
                  minimum: 0,
                  maximum: 100,
                  description: 'Progress percentage for the task (0-100)'
                },
                tags: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'New array of tags for the task'
                }
              },
              required: ['task_id']
            }
          },
          {
            name: 'delete_goodday_task',
            description: 'Delete a GoodDay task by ID',
            inputSchema: {
              type: 'object',
              properties: {
                task_id: {
                  type: 'string',
                  description: 'ID of the task to delete'
                }
              },
              required: ['task_id']
            }
          },
          {
            name: 'goodday_health_check',
            description: 'Check the health status of the GoodDay API connection',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'list_goodday_projects':
            return await this.handleListProjects();

          case 'list_goodday_users':
            return await this.handleListUsers();

          case 'get_goodday_project':
            return await this.handleGetProject(args?.project_id as string);

          case 'get_goodday_user':
            return await this.handleGetUser(args?.user_id as string);

          case 'list_goodday_tasks':
            return await this.handleListTasks(args?.project_id as string, args?.project_name as string);

          case 'get_goodday_task':
            return await this.handleGetTask(args?.task_id as string);

          case 'create_goodday_task':
            return await this.handleCreateTask(args);

          case 'update_goodday_task':
            return await this.handleUpdateTask(args?.task_id as string, args);

          case 'delete_goodday_task':
            return await this.handleDeleteTask(args?.task_id as string);

          case 'goodday_health_check':
            return await this.handleHealthCheck();

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        console.error(`[MCP Server] Error handling tool ${name}:`, error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
            }
          ]
        };
      }
    });
  }

  private async handleListProjects() {
    try {
      const projects = await this.goodDayService.getProjects();
      console.log('[MCP Server] Projects response:', projects);
      
      if (!projects || !Array.isArray(projects)) {
        return {
          content: [
            {
              type: 'text',
              text: '❌ Error: Invalid response from GoodDay API - projects is not an array'
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Found ${projects.length} projects:\n\n${projects.map(project => 
              `- **${project.name}** (ID: ${project.id})\n  Description: ${project.description || 'No description'}\n  Status: ${project.status || 'Unknown'}\n  Progress: ${project.progress || 0}%\n`
            ).join('\n')}`
          }
        ]
      };
    } catch (error) {
      console.error('[MCP Server] Error in handleListProjects:', error);
      return {
        content: [
          {
            type: 'text',
            text: `❌ Error fetching projects: ${error instanceof Error ? error.message : 'Unknown error'}`
          }
        ]
      };
    }
  }

  private async handleListUsers() {
    const users = await this.goodDayService.getUsers();
    return {
      content: [
        {
          type: 'text',
          text: `Found ${users.length} users:\n\n${users.map(user => 
            `- **${user.firstName} ${user.lastName}** (ID: ${user.id})\n  Email: ${user.email}\n  Role: ${user.role || 'Not specified'}\n  Department: ${user.department || 'Not specified'}\n`
          ).join('\n')}`
        }
      ]
    };
  }

  private async handleGetProject(projectId: string) {
    const project = await this.goodDayService.getProjectById(projectId);
    return {
      content: [
        {
          type: 'text',
          text: `**Project Details:**\n\n**Name:** ${project.name}\n**ID:** ${project.id}\n**Description:** ${project.description || 'No description'}\n**Status:** ${project.status || 'Unknown'}\n**Progress:** ${project.progress || 0}%\n**Owner:** ${project.ownerName || 'Not specified'}\n**Team Size:** ${project.teamSize || 'Not specified'}`
        }
      ]
    };
  }

  private async handleGetUser(userId: string) {
    const user = await this.goodDayService.getUserById(userId);
    return {
      content: [
        {
          type: 'text',
          text: `**User Details:**\n\n**Name:** ${user.firstName} ${user.lastName}\n**ID:** ${user.id}\n**Email:** ${user.email}\n**Role:** ${user.role || 'Not specified'}\n**Department:** ${user.department || 'Not specified'}\n**Active:** ${user.isActive ? 'Yes' : 'No'}`
        }
      ]
    };
  }

  private async handleListTasks(projectId?: string, projectName?: string) {
    try {
      let resolvedProjectId = projectId;
      
      // Handle project name to ID conversion
      if (projectName && !projectId) {
        const projects = await this.goodDayService.getProjects();
        const project = projects.find(p => 
          p.name.toLowerCase().includes(projectName.toLowerCase())
        );
        
        if (!project) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ **Project not found!**\n\nCould not find a project matching "${projectName}".\n\nAvailable projects:\n${projects.map(p => `- ${p.name} (ID: ${p.id})`).join('\n')}`
              }
            ]
          };
        }
        
        resolvedProjectId = project.id;
        console.log(`[MCP Server] Resolved project name "${projectName}" to ID: ${resolvedProjectId}`);
      }
      
      const tasks = await this.goodDayService.getTasks(resolvedProjectId);
      const filterText = resolvedProjectId ? ` for project ${projectName || resolvedProjectId}` : '';
      
      return {
        content: [
          {
            type: 'text',
            text: `Found ${tasks.length} tasks${filterText}:\n\n${tasks.map(task => 
              `- **${task.title}** (ID: ${task.id})\n  Status: ${task.status}\n  Priority: ${task.priority || 'Not set'}\n  Assignee: ${task.assigneeName || 'Unassigned'}\n  Progress: ${task.progress || 0}%\n  Due Date: ${task.dueDate || 'Not set'}\n`
            ).join('\n')}`
          }
        ]
      };
    } catch (error) {
      console.error('[MCP Server] Error in handleListTasks:', error);
      return {
        content: [
          {
            type: 'text',
            text: `❌ **Error fetching tasks:** ${error instanceof Error ? error.message : 'Unknown error'}`
          }
        ]
      };
    }
  }

  private async handleGetTask(taskId: string) {
    const task = await this.goodDayService.getTaskById(taskId);
    return {
      content: [
        {
          type: 'text',
          text: `**Task Details:**\n\n**Title:** ${task.title}\n**ID:** ${task.id}\n**Description:** ${task.description || 'No description'}\n**Status:** ${task.status}\n**Priority:** ${task.priority || 'Not set'}\n**Assignee:** ${task.assigneeName || 'Unassigned'}\n**Project:** ${task.projectName || 'Unknown'}\n**Progress:** ${task.progress || 0}%\n**Due Date:** ${task.dueDate || 'Not set'}\n**Estimated Hours:** ${task.estimatedHours || 'Not set'}\n**Actual Hours:** ${task.actualHours || 'Not set'}`
        }
      ]
    };
  }

  private async handleCreateTask(args: any) {
    try {
      // Convert priority string to number for GoodDay API
      const priorityMap: { [key: string]: number } = {
        'low': 1,
        'normal': 3,
        'high': 5,
        'urgent': 7
      };
      
      // Handle project name to ID conversion
      let projectId = args.project_id;
      if (args.project_name && !args.project_id) {
        const projects = await this.goodDayService.getProjects();
        const project = projects.find(p => 
          p.name.toLowerCase().includes(args.project_name.toLowerCase())
        );
        
        if (!project) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ **Project not found!**\n\nCould not find a project matching "${args.project_name}".\n\nAvailable projects:\n${projects.map(p => `- ${p.name} (ID: ${p.id})`).join('\n')}`
              }
            ]
          };
        }
        
        projectId = project.id;
        console.log(`[MCP Server] Resolved project name "${args.project_name}" to ID: ${projectId}`);
      }
      
      // Use correct GoodDay API field names based on official documentation
      const taskData: GoodDayTaskCreate = {
        title: args.title,
        message: args.description, // GoodDay API uses 'message' for task description
        projectId: projectId,
        toUserId: args.assignee_id, // GoodDay API uses 'toUserId' for assignee
        priority: args.priority ? priorityMap[args.priority] || 3 : 3, // Default to normal (3)
        deadline: args.due_date, // GoodDay API uses 'deadline' instead of 'dueDate'
        estimate: args.estimated_hours ? args.estimated_hours * 60 : undefined, // Convert hours to minutes
        fromUserId: 'pqj4fL' // Default user ID
      };

      const task = await this.goodDayService.createTask(taskData);
      
      // Create a detailed response message
      let responseMessage = `✅ **Task created successfully!**\n\n**Title:** ${task.title}\n**ID:** ${task.id}\n**Project:** ${task.projectName || args.project_name}\n**Status:** ${task.status || 'Not started'}\n**Assignee:** ${task.assigneeName || 'Unassigned'}`;
      
      // Add additional details if available
      if (args.priority) {
        responseMessage += `\n**Priority:** ${args.priority}`;
      }
      if (args.due_date) {
        responseMessage += `\n**Due Date:** ${args.due_date}`;
      }
      if (args.estimated_hours) {
        responseMessage += `\n**Estimated Hours:** ${args.estimated_hours}`;
      }
      
      // Add description confirmation if provided
      if (args.description) {
        responseMessage += `\n**Description:** ✅ Included`;
      }
      
      // Note about tags limitation
      if (args.tags && args.tags.length > 0) {
        responseMessage += `\n\n⚠️ **Note:** Tags are not currently supported by the GoodDay API. The tags "${args.tags.join(', ')}" were not added to the task.`;
      }
      
      return {
        content: [
          {
            type: 'text',
            text: responseMessage
          }
        ]
      };
    } catch (error) {
      console.error('[MCP Server] Error in handleCreateTask:', error);
      return {
        content: [
          {
            type: 'text',
            text: `❌ **Error creating task:** ${error instanceof Error ? error.message : 'Unknown error'}`
          }
        ]
      };
    }
  }

  private async handleUpdateTask(taskId: string, args: any) {
    const updateData: GoodDayTaskUpdate = {
      title: args.title,
      message: args.description, // GoodDay API uses 'message' for task description
      status: args.status,
      priority: args.priority,
      toUserId: args.assignee_id, // GoodDay API uses 'toUserId' for assignee
      deadline: args.due_date, // GoodDay API uses 'deadline' instead of 'dueDate'
      estimate: args.estimated_hours ? args.estimated_hours * 60 : undefined, // Convert hours to minutes
      progress: args.progress
    };

    const task = await this.goodDayService.updateTask(taskId, updateData);
    return {
      content: [
        {
          type: 'text',
          text: `✅ **Task updated successfully!**\n\n**Title:** ${task.title}\n**ID:** ${task.id}\n**Status:** ${task.status}\n**Priority:** ${task.priority || 'Not set'}\n**Assignee:** ${task.assigneeName || 'Unassigned'}\n**Progress:** ${task.progress || 0}%`
        }
      ]
    };
  }

  private async handleDeleteTask(taskId: string) {
    await this.goodDayService.deleteTask(taskId);
    return {
      content: [
        {
          type: 'text',
          text: `✅ **Task deleted successfully!**\n\nTask ID: ${taskId}`
        }
      ]
    };
  }

  private async handleHealthCheck() {
    const isHealthy = await this.goodDayService.healthCheck();
    return {
      content: [
        {
          type: 'text',
          text: isHealthy 
            ? '✅ **GoodDay API is healthy and connected!**'
            : '❌ **GoodDay API connection failed!**'
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('GoodDay MCP Server started');
  }
} 