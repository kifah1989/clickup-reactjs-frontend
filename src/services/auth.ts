import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  role?: "ADMIN" | "EDITOR" | "VIEWER";
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  role: string;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem("jwt_token");
  }

  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      credentials
    );
    this.setToken(response.data.access_token);
    return response.data;
  }

  async register(userData: RegisterDto): Promise<AuthResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/auth/register`,
      userData
    );
    this.setToken(response.data.access_token);
    return response.data;
  }

  async getProfile(): Promise<UserProfile> {
    if (!this.token) {
      throw new Error("No authentication token");
    }

    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return response.data;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("jwt_token", token);
  }

  getToken(): string | null {
    return this.token;
  }

  logout() {
    this.token = null;
    localStorage.removeItem("jwt_token");
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const authService = new AuthService();
