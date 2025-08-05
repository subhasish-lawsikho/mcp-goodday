import { GoodDayApiService } from '../services/goodday-api.js';
import { GoodDayTaskCreate, GoodDayTaskUpdate } from '../types/goodday.js';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }))
}));

describe('GoodDayApiService', () => {
  let service: GoodDayApiService;
  let mockAxios: any;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new GoodDayApiService('test-api-key', 'test-org-id', 'https://api.test.com');
    mockAxios = require('axios').create();
  });

  describe('constructor', () => {
    it('should create service with correct configuration', () => {
      expect(service).toBeDefined();
    });
  });

  describe('getUsers', () => {
    it('should return users successfully', async () => {
      const mockUsers = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' }
      ];

      mockAxios.get.mockResolvedValue({
        data: { success: true, data: mockUsers }
      });

      const result = await service.getUsers();
      expect(result).toEqual(mockUsers);
      expect(mockAxios.get).toHaveBeenCalledWith('/users');
    });

    it('should handle API errors', async () => {
      mockAxios.get.mockRejectedValue(new Error('API Error'));

      await expect(service.getUsers()).rejects.toThrow('Failed to fetch users: API Error');
    });
  });

  describe('getProjects', () => {
    it('should return projects successfully', async () => {
      const mockProjects = [
        { id: '1', name: 'Project A', description: 'Test project' },
        { id: '2', name: 'Project B', description: 'Another project' }
      ];

      mockAxios.get.mockResolvedValue({
        data: { success: true, data: mockProjects }
      });

      const result = await service.getProjects();
      expect(result).toEqual(mockProjects);
      expect(mockAxios.get).toHaveBeenCalledWith('/projects');
    });
  });

  describe('getTasks', () => {
    it('should return all tasks when no project ID provided', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', status: 'active' },
        { id: '2', title: 'Task 2', status: 'completed' }
      ];

      mockAxios.get.mockResolvedValue({
        data: { success: true, data: mockTasks }
      });

      const result = await service.getTasks();
      expect(result).toEqual(mockTasks);
      expect(mockAxios.get).toHaveBeenCalledWith('/tasks');
    });

    it('should return tasks for specific project when project ID provided', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', status: 'active' }
      ];

      mockAxios.get.mockResolvedValue({
        data: { success: true, data: mockTasks }
      });

      const result = await service.getTasks('project-123');
      expect(result).toEqual(mockTasks);
      expect(mockAxios.get).toHaveBeenCalledWith('/projects/project-123/tasks');
    });
  });

  describe('createTask', () => {
    it('should create task successfully', async () => {
      const taskData: GoodDayTaskCreate = {
        title: 'New Task',
        description: 'Task description',
        projectId: 'project-123'
      };

      const mockCreatedTask = {
        id: 'task-123',
        title: 'New Task',
        description: 'Task description',
        projectId: 'project-123',
        status: 'active'
      };

      mockAxios.post.mockResolvedValue({
        data: { success: true, data: mockCreatedTask }
      });

      const result = await service.createTask(taskData);
      expect(result).toEqual(mockCreatedTask);
      expect(mockAxios.post).toHaveBeenCalledWith('/tasks', taskData);
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const taskId = 'task-123';
      const updateData: GoodDayTaskUpdate = {
        title: 'Updated Task',
        status: 'completed'
      };

      const mockUpdatedTask = {
        id: 'task-123',
        title: 'Updated Task',
        status: 'completed'
      };

      mockAxios.put.mockResolvedValue({
        data: { success: true, data: mockUpdatedTask }
      });

      const result = await service.updateTask(taskId, updateData);
      expect(result).toEqual(mockUpdatedTask);
      expect(mockAxios.put).toHaveBeenCalledWith(`/tasks/${taskId}`, updateData);
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      const taskId = 'task-123';

      mockAxios.delete.mockResolvedValue({});

      await service.deleteTask(taskId);
      expect(mockAxios.delete).toHaveBeenCalledWith(`/tasks/${taskId}`);
    });
  });

  describe('healthCheck', () => {
    it('should return true when API is healthy', async () => {
      mockAxios.get.mockResolvedValue({});

      const result = await service.healthCheck();
      expect(result).toBe(true);
      expect(mockAxios.get).toHaveBeenCalledWith('/health');
    });

    it('should return false when API is unhealthy', async () => {
      mockAxios.get.mockRejectedValue(new Error('Connection failed'));

      const result = await service.healthCheck();
      expect(result).toBe(false);
    });
  });
}); 