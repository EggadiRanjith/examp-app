import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Result = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResult();
  }, [id]);

  const fetchResult = async () => {
    try {
      const response = await axios.get(`/api/exam/result/${id}`);
      setResult(response.data.result);
    } catch (error) {
      console.error('Error fetching result:', error);
      setError('Failed to load exam result. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#28a745';
    if (percentage >= 60) return '#ffc107';
    return '#dc3545';
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  if (loading) {
    return (
      <div className="result-container">
        <div className="loading">Loading exam result...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="result-container">
        <div className="card text-center">
          <div className="alert alert-error">{error}</div>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="result-container">
        <div className="card text-center">
          <h3>Result not found</h3>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="result-container">
      {/* Result Summary */}
      <div className="result-summary card">
        <h1 style={{ marginBottom: '2rem', color: '#333' }}>Exam Results</h1>
        
        <div className="result-score" style={{ color: getScoreColor(result.percentage) }}>
          {result.score}/{result.totalQuestions}
        </div>
        
        <div className="result-percentage" style={{ color: getScoreColor(result.percentage) }}>
          {result.percentage}% - Grade: {getGrade(result.percentage)}
        </div>

        <div style={{ 
          fontSize: '1.1rem', 
          color: '#666',
          marginBottom: '2rem'
        }}>
          {result.percentage >= 60 ? '🎉 Congratulations! You passed!' : '📚 Keep studying and try again!'}
        </div>

        <div className="result-details">
          <div className="result-detail">
            <div className="result-detail-value">{result.score}</div>
            <div className="result-detail-label">Correct Answers</div>
          </div>
          <div className="result-detail">
            <div className="result-detail-value">{result.totalQuestions - result.score}</div>
            <div className="result-detail-label">Incorrect Answers</div>
          </div>
          <div className="result-detail">
            <div className="result-detail-value">{formatTime(result.timeSpent)}</div>
            <div className="result-detail-label">Time Taken</div>
          </div>
          <div className="result-detail">
            <div className="result-detail-value">{formatDate(result.completedAt)}</div>
            <div className="result-detail-label">Completed On</div>
          </div>
        </div>
      </div>

      {/* Question Review */}
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Question Review</h3>
        
        {result.questions.map((questionResult, index) => (
          <div key={index} className="question-review">
            <div className="question-review-header">
              <div className="question-number">Q{index + 1}</div>
              <div className={`question-status ${questionResult.isCorrect ? 'correct' : 'incorrect'}`}>
                {questionResult.isCorrect ? '✓ Correct' : '✗ Incorrect'}
              </div>
            </div>

            <div className="question-text" style={{ marginBottom: '1rem' }}>
              {questionResult.question}
            </div>

            <div className="answer-options">
              {questionResult.options.map((option, optionIndex) => {
                let className = 'answer-option';
                
                if (optionIndex === questionResult.selectedOption) {
                  className += ' selected';
                }
                
                if (optionIndex === questionResult.correctOption) {
                  className += ' correct';
                } else if (optionIndex === questionResult.selectedOption && !questionResult.isCorrect) {
                  className += ' incorrect';
                }

                return (
                  <div key={optionIndex} className={className}>
                    <span style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>
                      {String.fromCharCode(65 + optionIndex)}.
                    </span>
                    {option}
                    {optionIndex === questionResult.correctOption && (
                      <span style={{ float: 'right', color: '#28a745', fontWeight: 'bold' }}>
                        ✓ Correct Answer
                      </span>
                    )}
                    {optionIndex === questionResult.selectedOption && optionIndex !== questionResult.correctOption && (
                      <span style={{ float: 'right', color: '#dc3545', fontWeight: 'bold' }}>
                        Your Answer
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="card text-center">
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
          <button 
            onClick={() => navigate('/exam')} 
            className="btn btn-success"
          >
            Take Another Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
