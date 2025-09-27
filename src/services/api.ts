import axios from "axios";
import { authService } from "./auth";
import { API_BASE_URL } from "../config";

// ClickUp API Types
export interface ClickUpWorkspace {
  id: string;
  name: string;
  color: string;
  avatar?: string;
  members: ClickUpUser[];
}

export interface ClickUpSpace {
  id: string;
  name: string;
  color?: string;
  private: boolean;
  avatar?: string;
  admin_can_manage?: boolean;
  statuses: Array<{
    id: string;
    status: string;
    type: string;
    orderindex: number;
    color: string;
  }>;
  multiple_assignees: boolean;
  archived: boolean;
}

export interface ClickUpList {
  id: string;
  name: string;
  orderindex: number;
  status?: string;
  priority?: {
    priority: string;
    color: string;
  };
  assignee?: {
    id: number;
    username?: string;
    color: string;
    email: string;
    profilePicture?: string;
  };
  task_count?: number;
  due_date?: string;
  due_date_time?: boolean;
  start_date?: string;
  start_date_time?: boolean;
  folder: {
    id: string;
    name: string;
    hidden: boolean;
    access: boolean;
  };
  space: {
    id: string;
    name: string;
    access: boolean;
  };
  archived: boolean;
  permission_level: string;
}

export interface ClickUpTask {
  id: string;
  name: string;
  description?: string;
  status: {
    id: string;
    status: string;
    color: string;
    type: string;
  };
  orderindex: string;
  date_created: string;
  date_updated: string;
  date_closed?: string;
  date_done?: string;
  archived: boolean;
  creator: {
    id: number;
    username?: string;
    color: string;
    email: string;
    profilePicture?: string;
  };
  assignees: Array<{
    id: number;
    username?: string;
    color: string;
    email: string;
    profilePicture?: string;
  }>;
  watchers: Array<{
    id: number;
    username?: string;
    color: string;
    email: string;
    profilePicture?: string;
  }>;
  tags: Array<{
    name: string;
    tag_fg: string;
    tag_bg: string;
    creator: number;
  }>;
  parent?: string;
  priority?: {
    id: string;
    priority: string;
    color: string;
    orderindex: string;
  };
  due_date?: string;
  start_date?: string;
  points?: number;
  time_estimate?: number;
  time_spent?: number;
  custom_fields: any[];
  dependencies: any[];
  linked_tasks: any[];
  team_id: string;
  url: string;
  permission_level: string;
  list: {
    id: string;
    name: string;
    access: boolean;
  };
  project: {
    id: string;
    name: string;
    hidden: boolean;
    access: boolean;
  };
  folder: {
    id: string;
    name: string;
    hidden: boolean;
    access: boolean;
  };
  space: {
    id: string;
  };
}

export interface ClickUpUser {
  id: number;
  username: string;
  color: string;
  profilePicture?: string;
  initials: string;
  email: string;
  role: number;
  custom_role?: any;
  last_active: string;
  date_joined: string;
  date_invited: string;
}

export interface CreateTaskDto {
  name: string;
  description?: string;
  status?: string;
  priority?: number;
  due_date?: number;
  start_date?: number;
  time_estimate?: number;
  assignees?: number[];
  tags?: string[];
  parent?: string;
  markdown?: boolean;
  custom_fields?: Array<{
    id: string;
    value: any;
  }>;
}

// API Service

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      authService.logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export class ClickUpApiService {
  // Users & Workspaces
  static async getWorkspaces(): Promise<{ teams: ClickUpWorkspace[] }> {
    const response = await api.get("/api/users/workspaces");
    return response.data;
  }

  static async getCurrentUser(): Promise<{ user: ClickUpUser }> {
    const response = await api.get("/api/users/me");
    return response.data;
  }

  static async getWorkspaceMembers(
    workspaceId: string
  ): Promise<{ members: ClickUpUser[] }> {
    const response = await api.get(
      `/api/users/workspace/${workspaceId}/members`
    );
    return response.data;
  }

  // Spaces
  static async getSpaces(
    workspaceId: string,
    archived?: boolean
  ): Promise<{ spaces: ClickUpSpace[] }> {
    const params = archived !== undefined ? { archived } : {};
    const response = await api.get(`/api/spaces/workspace/${workspaceId}`, {
      params,
    });
    return response.data;
  }

  static async getSpaceById(spaceId: string): Promise<ClickUpSpace> {
    const response = await api.get(`/api/spaces/${spaceId}`);
    return response.data;
  }

  static async createSpace(
    _workspaceId: string,
    _spaceData: { name: string; multiple_assignees?: boolean }
  ): Promise<ClickUpSpace> {
    throw new Error("This feature is currently disabled");
  }

  static async updateSpace(
    _spaceId: string,
    _spaceData: any
  ): Promise<ClickUpSpace> {
    throw new Error("This feature is currently disabled");
  }

  static async deleteSpace(_spaceId: string): Promise<void> {
    throw new Error("This feature is currently disabled");
  }

  // Lists
  static async getListsBySpace(
    spaceId: string,
    archived?: boolean
  ): Promise<{ lists: ClickUpList[] }> {
    const params = archived !== undefined ? { archived } : {};
    const response = await api.get(`/api/lists/space/${spaceId}`, { params });
    return response.data;
  }

  static async getListById(listId: string): Promise<ClickUpList> {
    const response = await api.get(`/api/lists/${listId}`);
    return response.data;
  }

  static async createListInSpace(
    _spaceId: string,
    _listData: { name: string; content?: string }
  ): Promise<ClickUpList> {
    throw new Error("This feature is currently disabled");
  }

  static async updateList(
    _listId: string,
    _listData: any
  ): Promise<ClickUpList> {
    throw new Error("This feature is currently disabled");
  }

  static async deleteList(_listId: string): Promise<void> {
    throw new Error("This feature is currently disabled");
  }

  // Tasks
  static async getTasksByList(
    listId: string,
    params?: {
      archived?: boolean;
      page?: number;
      order_by?: "created" | "updated" | "due_date";
      reverse?: boolean;
      subtasks?: boolean;
      include_closed?: boolean;
    }
  ): Promise<{ tasks: ClickUpTask[] }> {
    const response = await api.get(`/api/tasks/list/${listId}`, { params });
    return response.data;
  }

  static async getTaskById(taskId: string): Promise<ClickUpTask> {
    const response = await api.get(`/api/tasks/${taskId}`);
    return response.data;
  }

  static async createTask(
    _listId: string,
    _taskData: CreateTaskDto
  ): Promise<ClickUpTask> {
    throw new Error("This feature is currently disabled");
  }

  static async updateTask(
    _taskId: string,
    _taskData: Partial<CreateTaskDto>
  ): Promise<ClickUpTask> {
    throw new Error("This feature is currently disabled");
  }

  static async deleteTask(_taskId: string): Promise<void> {
    throw new Error("This feature is currently disabled");
  }
}
