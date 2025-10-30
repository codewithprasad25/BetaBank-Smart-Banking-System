// API Configuration and Base Service

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.3:8080/api';



export class ApiError extends Error {
  constructor(public message: string, public status?: number, public errors?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('banking_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  };


  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Try to read any error body (JSON or text)
      const text = await response.text().catch(() => '');
      let errorData: any = undefined;
      if (text) {
        try { errorData = JSON.parse(text); } catch { errorData = { message: text }; }
      }
      throw new ApiError(
        errorData?.message ?? `HTTP ${response.status}`,
        response.status,
        errorData?.errors
      );
    }

    // Handle empty responses (204 No Content or empty body)
    const text = await response.text().catch(() => '');
    if (!text) {
      return undefined as unknown as T;
    }

    // Parse JSON if possible, otherwise return raw text
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      return text as unknown as T;
    }

    // Support wrapped responses { data: ... }
    return parsed.data !== undefined ? parsed.data : parsed;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error occurred');
  }
}


export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint),
  post: <T>(endpoint: string, data?: any) => 
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  put: <T>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  patch: <T>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};