// src/components/AdminView.jsx
import { useState } from 'react';

function AdminView({ feedbacks, loading, darkMode }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Submitted Feedback
      </h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p>No feedback submissions yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {feedbacks.map((feedback, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg shadow-md transition-all hover:shadow-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{feedback.name}</h3>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {feedback.timestamp ? formatDate(feedback.timestamp) : 'No date'}
                </span>
              </div>
              <p className={`text-sm mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{feedback.email}</p>
              <p className={`text-sm whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {feedback.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminView;