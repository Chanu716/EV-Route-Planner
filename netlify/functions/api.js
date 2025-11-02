import { connectToDatabase } from './utils/db.js';

// Example serverless function handler
export async function handler(event, context) {
  // Prevent function from timing out
  context.callbackWaitsForEmptyEventLoop = false;

  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Connect to database
    await connectToDatabase();

    // Handle different API routes based on path
    const path = event.path.replace('/.netlify/functions/', '');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'API is working!',
        path: path,
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
      }),
    };
  }
}
