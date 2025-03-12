import { auth } from './firebase';

// Direct server URL
export const SERVER_URL = "https://amplify-dev-6b1c7.uc.r.appspot.com";

// Custom error class for server errors
export class ServerError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ServerError';
    this.status = status;
  }
}

// Global flag to track if we've detected a server issue
let serverIssueDetected = false;

// Function to notify about server issues
export function notifyServerIssue() {
  serverIssueDetected = true;
  
  // Dispatch a custom event that the ServerStatusContext can listen for
  const event = new CustomEvent('server-issue-detected');
  window.dispatchEvent(event);
  
  console.error('Server issue detected and notification sent');
}

/**
 * Makes an authenticated API request to the server
 * @param {string} endpoint - The API endpoint (without the base URL)
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} - The fetch response
 */
export async function apiRequest(endpoint, options = {}) {
  try {
    // Get the authentication token
    const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : null;
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      ...(idToken && { 'Authorization': `Bearer ${idToken}` }),
      ...options.headers
    };
    
    // Create an AbortController to handle timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout (reduced from 15s)
    
    // Make the request directly to the server URL
    const response = await fetch(`${SERVER_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`API request timeout for ${endpoint}`);
      notifyServerIssue();
      throw new ServerError('Request timeout: The server took too long to respond. Please try again.', 408);
    }
    
    // Network errors (like CORS, server down, etc.)
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      console.error(`Server connection error for ${endpoint}`);
      notifyServerIssue();
      throw new ServerError('Unable to connect to the server. Please check your internet connection or try again later.', 503);
    }
    
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Makes a GET request to the API
 * @param {string} endpoint - The API endpoint
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - The parsed JSON response
 */
export async function get(endpoint, options = {}) {
  try {
    const response = await apiRequest(endpoint, {
      method: 'GET',
      ...options
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Return null for 404 responses
      }
      
      // Handle server errors
      if (response.status >= 500) {
        notifyServerIssue();
        throw new ServerError(`Server error: ${response.status} ${response.statusText}`, response.status);
      }
      
      throw new Error(`API GET error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    // Rethrow ServerError instances
    if (error instanceof ServerError) {
      throw error;
    }
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      notifyServerIssue();
      throw new ServerError('Invalid response from server', 500);
    }
    
    throw error;
  }
}

/**
 * Makes a POST request to the API
 * @param {string} endpoint - The API endpoint
 * @param {Object} data - The data to send
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - The parsed JSON response
 */
export async function post(endpoint, data, options = {}) {
  console.log(`Making POST request to ${endpoint}`, data);
  try {
    const response = await apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
    
    console.log(`POST response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API POST error: ${response.status} ${response.statusText}`, errorText);
      
      // Handle server errors
      if (response.status >= 500) {
        notifyServerIssue();
        throw new ServerError(`Server error: ${response.status} ${response.statusText}`, response.status);
      }
      
      throw new Error(`API POST error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log(`POST response data:`, responseData);
    return responseData;
  } catch (error) {
    console.error(`POST request to ${endpoint} failed:`, error);
    
    // Rethrow ServerError instances
    if (error instanceof ServerError) {
      throw error;
    }
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      notifyServerIssue();
      throw new ServerError('Invalid response from server', 500);
    }
    
    throw error;
  }
}

/**
 * Makes a PUT request to the API
 * @param {string} endpoint - The API endpoint
 * @param {Object} data - The data to send
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - The parsed JSON response
 */
export async function put(endpoint, data, options = {}) {
  try {
    const response = await apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
    
    if (!response.ok) {
      // Handle server errors
      if (response.status >= 500) {
        notifyServerIssue();
        throw new ServerError(`Server error: ${response.status} ${response.statusText}`, response.status);
      }
      
      throw new Error(`API PUT error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    // Rethrow ServerError instances
    if (error instanceof ServerError) {
      throw error;
    }
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      notifyServerIssue();
      throw new ServerError('Invalid response from server', 500);
    }
    
    throw error;
  }
}

/**
 * Makes a DELETE request to the API
 * @param {string} endpoint - The API endpoint
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - The parsed JSON response
 */
export async function del(endpoint, options = {}) {
  try {
    const response = await apiRequest(endpoint, {
      method: 'DELETE',
      ...options
    });
    
    if (!response.ok) {
      // Handle server errors
      if (response.status >= 500) {
        notifyServerIssue();
        throw new ServerError(`Server error: ${response.status} ${response.statusText}`, response.status);
      }
      
      throw new Error(`API DELETE error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    // Rethrow ServerError instances
    if (error instanceof ServerError) {
      throw error;
    }
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      notifyServerIssue();
      throw new ServerError('Invalid response from server', 500);
    }
    
    throw error;
  }
}

/**
 * Fetches all namespaces for the current user
 * @returns {Promise<Array>} - Array of namespace objects
 */
export async function fetchUserNamespaces() {
  // Get the current user ID
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  return get(`/namespaces/account/${userId}`);
}

/**
 * Fetches a specific namespace by ID
 * @param {string} namespaceId - The ID of the namespace to fetch
 * @returns {Promise<Object>} - The namespace object
 */
export async function fetchNamespaceById(namespaceId) {
  return get(`/namespaces/${namespaceId}`);
}

/**
 * Creates a new namespace
 * @param {Object} namespaceData - The namespace data
 * @returns {Promise<Object>} - The created namespace object
 */
export async function createNamespace(namespaceData) {
  return post('/namespaces', namespaceData);
}

/**
 * Updates an existing namespace
 * @param {string} namespaceId - The ID of the namespace to update
 * @param {Object} namespaceData - The updated namespace data
 * @returns {Promise<Object>} - The updated namespace object
 */
export async function updateNamespace(namespaceId, namespaceData) {
  return put(`/namespaces/${namespaceId}`, namespaceData);
}

/**
 * Deletes a namespace
 * @param {string} namespaceId - The ID of the namespace to delete
 * @returns {Promise<Object>} - The response object
 */
export async function deleteNamespace(namespaceId) {
  return del(`/namespaces/${namespaceId}`);
} 