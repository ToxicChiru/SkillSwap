const API_BASE = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000/api' 
    : '/api');

const getAuthHeader = () => {
  const token = localStorage.getItem('skillswap_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
};

const getFullUrl = (endpoint, params = {}) => {
  const isAbsolute = API_BASE.startsWith('http');
  const url = isAbsolute 
    ? new URL(`${API_BASE}${endpoint}`) 
    : new URL(`${API_BASE}${endpoint}`, window.location.origin);

  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

export const api = {
  get: async (endpoint, params = {}) => {
    const fullUrl = getFullUrl(endpoint, params);
    const res = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    return handleResponse(res);
  },

  post: async (endpoint, body = {}) => {
    const fullUrl = getFullUrl(endpoint);
    const res = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  put: async (endpoint, body = {}) => {
    const fullUrl = getFullUrl(endpoint);
    const res = await fetch(fullUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  delete: async (endpoint) => {
    const fullUrl = getFullUrl(endpoint);
    const res = await fetch(fullUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    return handleResponse(res);
  }
};
