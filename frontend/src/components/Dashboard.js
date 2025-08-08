import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [examHistory, setExamHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExamHistory();
  }, []);

  const fetchExamHistory = async () => {
    try {
      const response = await axios.get('/api/exam/history');
      setExamHistory(response.data.results);
    } catch (error) {
      console.error('Error fetching exam history:', error);
    } finally {
      setLoading(false);
    }
  };

  const startExam = () => {
    navigate('/exam');
  };

  const viewResult = (resultId) => {
    navigate(`/result/${resultId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="dashboard-container">
      <div className="welcome-card card">
        <h1 className="welcome-title">Welcome back, {user?.name}!</h1>
        <p>Ready to take your next exam? Click the button below to get started.</p>
      </div>

      <div className="exam-card card">
        <div className="exam-info">
          <h3>Start New Exam</h3>
          <div className="exam-details">
            <div className="exam-detail">
              <div className="exam-detail-value">10</div>
              <div className="exam-detail-label">Questions</div>
            </div>
            <div className="exam-detail">
              <div className="exam-detail-value">30</div>
              <div className="exam-detail-label">Minutes</div>
            </div>
            <div className="exam-detail">
              <div className="exam-detail-value">MCQ</div>
              <div className="exam-detail-label">Format</div>
            </div>
          </div>
        </div>
        <button 
          onClick={startExam}
          className="btn btn-primary"
          style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
        >
          Start Exam
        </button>
      </div>

      {loading ? (
        <div className="card">
          <div className="loading">Loading exam history...</div>
        </div>
      ) : (
        <div className="card">
          <h3>Exam History</h3>
          {examHistory.length === 0 ? (
            <p>No previous exams found. Take your first exam above!</p>
          ) : (
            <div className="exam-history">
              {examHistory.map((result) => (
                <div key={result._id} className="exam-history-item" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  margin: '0.5rem 0',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      Score: {result.score}/{result.totalQuestions} ({result.percentage}%)
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      Completed: {formatDate(result.completedAt)} • 
                      Time: {formatTime(result.timeSpent)}
                    </div>
                  </div>
                  <button 
                    onClick={() => viewResult(result._id)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.9rem' }}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
