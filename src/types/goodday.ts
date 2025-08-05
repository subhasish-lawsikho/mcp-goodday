import { z } from 'zod';

// GoodDay API Response Schemas
export const GoodDayUserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  avatar: z.string().optional(),
  role: z.string().optional(),
  department: z.string().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export const GoodDayProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  ownerId: z.string().optional(),
  ownerName: z.string().optional(),
  teamSize: z.number().optional(),
  progress: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export const GoodDayTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.string(),
  priority: z.string().optional(),
  assigneeId: z.string().optional(),
  assigneeName: z.string().optional(),
  projectId: z.string(),
  projectName: z.string().optional(),
  dueDate: z.string().optional(),
  estimatedHours: z.number().optional(),
  actualHours: z.number().optional(),
  progress: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

// Updated to use correct GoodDay API field names based on official documentation
export const GoodDayTaskCreateSchema = z.object({
  title: z.string(),
  message: z.string().optional(), // GoodDay API uses 'message' for task description
  projectId: z.string(),
  toUserId: z.string().optional(), // GoodDay API uses 'toUserId' for assignee
  fromUserId: z.string().optional(),
  priority: z.number().optional(),
  deadline: z.string().optional(), // GoodDay API uses 'deadline' instead of 'dueDate'
  estimate: z.number().optional(), // GoodDay API uses 'estimate' instead of 'estimatedHours'
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  taskTypeId: z.string().optional(),
  parentTaskId: z.string().optional(),
  storyPoints: z.number().optional(),
  todoList: z.any().optional(),
  crmContactIds: z.array(z.string()).optional(),
  crmAccountId: z.string().optional()
});

export const GoodDayTaskUpdateSchema = z.object({
  title: z.string().optional(),
  message: z.string().optional(), // GoodDay API uses 'message' for task description
  status: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
  toUserId: z.string().optional(), // GoodDay API uses 'toUserId' for assignee
  deadline: z.string().optional(), // GoodDay API uses 'deadline' instead of 'dueDate'
  estimate: z.number().optional(), // GoodDay API uses 'estimate' instead of 'estimatedHours'
  progress: z.number().min(0).max(100).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

// Type exports
export type GoodDayUser = z.infer<typeof GoodDayUserSchema>;
export type GoodDayProject = z.infer<typeof GoodDayProjectSchema>;
export type GoodDayTask = z.infer<typeof GoodDayTaskSchema>;
export type GoodDayTaskCreate = z.infer<typeof GoodDayTaskCreateSchema>;
export type GoodDayTaskUpdate = z.infer<typeof GoodDayTaskUpdateSchema>;

// API Response types
export interface GoodDayApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface GoodDayApiListResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  message?: string;
  error?: string;
} 