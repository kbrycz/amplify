import { auth } from './firebase';

// Direct server URL
export const SERVER_URL = "https://amplify-dev-6b1c7.uc.r.appspot.com";

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
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
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
      throw new Error(`Request timeout: The server took too long to respond. Please try again.`);
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
  const response = await apiRequest(endpoint, {
    method: 'GET',
    ...options
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      return null; // Return null for 404 responses
    }
    throw new Error(`API GET error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
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
      throw new Error(`API POST error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log(`POST response data:`, responseData);
    return responseData;
  } catch (error) {
    console.error(`POST request to ${endpoint} failed:`, error);
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
  const response = await apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options
  });
  
  if (!response.ok) {
    throw new Error(`API PUT error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Makes a DELETE request to the API
 * @param {string} endpoint - The API endpoint
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - The parsed JSON response
 */
export async function del(endpoint, options = {}) {
  const response = await apiRequest(endpoint, {
    method: 'DELETE',
    ...options
  });
  
  if (!response.ok) {
    throw new Error(`API DELETE error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
} 