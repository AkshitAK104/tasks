// netlify/functions/get-feedbacks.js
const fs = require('fs');
const path = require('path');

// Path to JSON file where feedbacks are stored
const FEEDBACKS_FILE = path.join(__dirname, 'feedbacks.json');

exports.handler = async (event, context) => {
  // Only allow GET method
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Check if feedbacks file exists
    if (fs.existsSync(FEEDBACKS_FILE)) {
      // Read and parse the feedbacks
      const data = fs.readFileSync(FEEDBACKS_FILE, 'utf8');
      const feedbacks = JSON.parse(data);
      
      // Sort feedbacks by timestamp (newest first)
      feedbacks.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      
      return {
        statusCode: 200,
        body: JSON.stringify(feedbacks)
      };
    } else {
      // If file doesn't exist yet, return empty array
      return {
        statusCode: 200,
        body: JSON.stringify([])
      };
    }
  } catch (error) {
    console.error('Error retrieving feedbacks:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};