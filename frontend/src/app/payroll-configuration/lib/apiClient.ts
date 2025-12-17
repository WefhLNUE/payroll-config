const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const apiClient = {
  async get(endpoint: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
    });
    
    const contentType = response.headers.get('content-type') || '';
    
    // Check for HTML responses first
    if (contentType.includes('text/html')) {
      throw new Error(`API endpoint not found. Please ensure the backend is running on ${API_BASE_URL}`);
    }
    
    if (!response.ok) {
      // Try to parse error as JSON, but handle empty responses
      const text = await response.text();
      if (text) {
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData?.message || `API Error: ${response.status}`);
        } catch {
          throw new Error(`API Error: ${response.status}`);
        }
      } else {
        throw new Error(`API Error: ${response.status}`);
      }
    }
    
    // Handle empty responses (204 No Content or empty body)
    if (response.status === 204 || !contentType.includes('application/json')) {
      return null;
    }
    
    const text = await response.text();
    if (!text || text.trim() === '') {
      return null;
    }
    
    try {
      return JSON.parse(text);
    } catch (err) {
      throw new Error(`Invalid JSON response from API. Please check ${API_BASE_URL}${endpoint}`);
    }
  },

  async post(endpoint: string, data: any): Promise<any> {
    console.log('API POST:', endpoint, data);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const contentType = response.headers.get('content-type') || '';
    
    // Check for HTML responses first
    if (contentType.includes('text/html')) {
      throw new Error(`API endpoint not found. Please ensure the backend is running on ${API_BASE_URL}`);
    }
    
    if (!response.ok) {
      // Try to parse error as JSON, but handle empty responses
      const text = await response.text();
      if (text) {
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData?.message || `API Error: ${response.status}`);
        } catch {
          throw new Error(`API Error: ${response.status}`);
        }
      } else {
        throw new Error(`API Error: ${response.status}`);
      }
    }
    
    // Handle empty responses (204 No Content or empty body)
    if (response.status === 204 || !contentType.includes('application/json')) {
      return null;
    }
    
    const text = await response.text();
    if (!text || text.trim() === '') {
      return null;
    }
    
    try {
      return JSON.parse(text);
    } catch (err) {
      throw new Error(`Invalid JSON response from API. Please check ${API_BASE_URL}${endpoint}`);
    }
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
