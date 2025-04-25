// server/index.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const feedbackFile = path.resolve(__dirname, 'feedbacks.json');

// Ensure the feedback file exists
if (!fs.existsSync(feedbackFile)) {
  fs.writeFileSync(feedbackFile, JSON.stringify([]));
}

// Middleware to handle JSON requests
app.use(express.json());

// Route to handle feedback submissions
app.post('/api/submit-feedback', (req, res) => {
  const feedback = req.body;
  const feedbacks = JSON.parse(fs.readFileSync(feedbackFile));
  feedbacks.push(feedback);
  fs.writeFileSync(feedbackFile, JSON.stringify(feedbacks, null, 2));
  res.json({ success: true });
});

// Route to get all feedbacks
app.get('/api/feedbacks', (req, res) => {
  const feedbacks = JSON.parse(fs.readFileSync(feedbackFile));
  res.json(feedbacks);
});

// Serve static files and frontend (optional)
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
