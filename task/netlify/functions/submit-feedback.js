// netlify/functions/submit-feedback.js
const fs = require('fs');
const path = require('path');

// Path to JSON file where feedbacks will be stored
const FEEDBACKS_FILE = path.join(__dirname, 'feedbacks.json');

// Helper to read existing feedbacks
const readFeedbacks = () => {
  try {
    if (fs.existsSync(FEEDBACKS_FILE)) {
      const data = fs.readFileSync(FEEDBACKS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading feedbacks file:', error);
    return [];
  }
};

// Helper to write feedbacks to file
const writeFeedbacks = (feedbacks) => {
  try {
    const dirPath = path.dirname(FEEDBACKS_FILE);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(FEEDBACKS_FILE, JSON.stringify(feedbacks, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing feedbacks file:', error);
    return false;
  }
};

exports.handler = async (event, context) => {
  // Only allow POST method
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the incoming request body
    const data = JSON.parse(event.body);
    
    // Basic validation
    if (!data.name || !data.email || !data.message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }
    
    // Read existing feedbacks
    const feedbacks = readFeedbacks();
    
    // Add new feedback with timestamp
    const newFeedback = {
      name: data.name,
      email: data.email,
      message: data.message,
      timestamp: data.timestamp || new Date().toISOString()
    };
    
    feedbacks.push(newFeedback);
    
    // Write updated feedbacks back to file
    if (writeFeedbacks(feedbacks)) {
      return {
        statusCode: 201,
        body: JSON.stringify({ success: true, message: 'Feedback submitted successfully' })
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to save feedback' })
      };
    }
  } catch (error) {
    console.error('Error processing feedback submission:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};