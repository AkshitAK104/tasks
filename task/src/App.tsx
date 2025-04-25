import { useState, useEffect } from 'react';
import FeedbackForm from './components/FeedbackForm';
import AdminView from './components/AdminView';
import ThemeToggle from './components/ThemeToggle';
import React from 'react';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Fetch feedbacks when admin view is toggled
  useEffect(() => {
    if (showAdmin) {
      fetchFeedbacks();
    }
  }, [showAdmin]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/feedbacks');
      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data);
      } else {
        console.error('Failed to fetch feedbacks');
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (feedbackData) => {
    setLoading(true);
    const timestamp = new Date().toISOString();
    const { name, email, message } = feedbackData;

    try {
      const response = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, timestamp }),
      });

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, message: 'Failed to submit feedback' };
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return { success: false, message: 'Error submitting feedback' };
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminView = () => {
    setShowAdmin(!showAdmin);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Feedback Portal</h1>
          <div className="flex space-x-2">
            <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <button
              onClick={toggleAdminView}
              className={`px-4 py-2 rounded-md transition-colors ${
                darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {showAdmin ? 'Submit Feedback' : 'View Submitted Feedback'}
            </button>
          </div>
        </header>

        <main>
          {showAdmin ? (
            <AdminView feedbacks={feedbacks} loading={loading} darkMode={darkMode} />
          ) : (
            <FeedbackForm onSubmit={handleSubmitFeedback} loading={loading} darkMode={darkMode} />
          )}
        </main>

        <footer className="mt-12 pt-4 border-t text-center text-sm text-gray-500">
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            © {new Date().getFullYear()} | Designed & Developed by AKSHIT CHAUDHARY | Feedback App
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
