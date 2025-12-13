const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const apiClient = {
  async get(endpoint: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `API Error: ${response.status}`);
    }
    return response.json();
  },

  async post(endpoint: string, data: any): Promise<any> {
    console.log('API POST:', endpoint, data);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `API Error: ${response.status}`);
    }
    return response.json();
  },

  async patch(endpoint: string, data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `API Error: ${response.status}`);
    }
    return response.json();
  },

  async delete(endpoint: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `API Error: ${response.status}`);
    }
    // Handle 204 No Content responses
    if (response.status === 204) {
      return;
    }
    return response.json();
  },
};
