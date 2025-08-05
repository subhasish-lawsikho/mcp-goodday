import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  GoodDayUser, 
  GoodDayProject, 
  GoodDayTask, 
  GoodDayTaskCreate, 
  GoodDayTaskUpdate,
  GoodDayApiResponse,
  GoodDayApiListResponse
} from '../types/goodday.js';

export class GoodDayApiService {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string, baseURL: string = 'https://api.goodday.work/2.0') {
    this.apiKey = apiKey;
    
    this.client = axios.create({
      baseURL,
      headers: {
        'gd-api-token': apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[GoodDay API] ${config.method?.toUpperCase()} ${config.url}`);
        console.log(`[GoodDay API] Headers:`, config.headers);
        return config;
      },
      (error) => {
        console.error('[GoodDay API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('[GoodDay API] Response error:', error.response?.data || error.message);
        console.error('[GoodDay API] Status:', error.response?.status);
        console.error('[GoodDay API] Status Text:', error.response?.statusText);
        return Promise.reject(error);
      }
    );
  }

  // Users API
  async getUsers(): Promise<GoodDayUser[]> {
    try {
      const response: AxiosResponse<GoodDayUser[]> = await this.client.get('/users');
      return response.data;
    } catch (error) {
      console.error('[GoodDay API] Failed to get users:', error);
      throw new Error(`Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserById(userId: string): Promise<GoodDayUser> {
    try {
      const response: AxiosResponse<GoodDayUser> = await this.client.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`[GoodDay API] Failed to get user ${userId}:`, error);
      throw new Error(`Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Projects API
  async getProjects(): Promise<GoodDayProject[]> {
    try {
      const response: AxiosResponse<GoodDayProject[]> = await this.client.get('/projects');
      return response.data;
    } catch (error) {
      console.error('[GoodDay API] Failed to get projects:', error);
      throw new Error(`Failed to fetch projects: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getProjectById(projectId: string): Promise<GoodDayProject> {
    try {
      const response: AxiosResponse<GoodDayProject> = await this.client.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error(`[GoodDay API] Failed to get project ${projectId}:`, error);
      throw new Error(`Failed to fetch project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Tasks API
  async getTasks(projectId?: string): Promise<GoodDayTask[]> {
    try {
      const url = projectId ? `/projects/${projectId}/tasks` : '/tasks';
      const response: AxiosResponse<GoodDayTask[]> = await this.client.get(url);
      return response.data;
    } catch (error) {
      console.error('[GoodDay API] Failed to get tasks:', error);
      throw new Error(`Failed to fetch tasks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTaskById(taskId: string): Promise<GoodDayTask> {
    try {
      const response: AxiosResponse<GoodDayTask> = await this.client.get(`/task/${taskId}`);
      return response.data;
    } catch (error) {
      console.error(`[GoodDay API] Failed to get task ${taskId}:`, error);
      throw new Error(`Failed to fetch task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createTask(taskData: GoodDayTaskCreate): Promise<GoodDayTask> {
    try {
      // Add fromUserId if not provided (using the first available user)
      const requestData = {
        ...taskData,
        fromUserId: taskData.fromUserId || 'pqj4fL' // Default user ID
      };
      
      const response: AxiosResponse<GoodDayTask> = await this.client.post('/tasks', requestData);
      return response.data;
    } catch (error) {
      console.error('[GoodDay API] Failed to create task:', error);
      throw new Error(`Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateTask(taskId: string, taskData: GoodDayTaskUpdate): Promise<GoodDayTask> {
    try {
      const response: AxiosResponse<GoodDayTask> = await this.client.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error(`[GoodDay API] Failed to update task ${taskId}:`, error);
      throw new Error(`Failed to update task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      await this.client.delete(`/tasks/${taskId}`);
    } catch (error) {
      console.error(`[GoodDay API] Failed to delete task ${taskId}:`, error);
      throw new Error(`Failed to delete task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      // Try different possible health check endpoints
      try {
        await this.client.get('/health');
        return true;
      } catch {
        try {
          await this.client.get('/api/health');
          return true;
        } catch {
          try {
            await this.client.get('/');
            return true;
          } catch {
            return false;
          }
        }
      }
    } catch (error) {
      console.error('[GoodDay API] Health check failed:', error);
      return false;
    }
  }
} 