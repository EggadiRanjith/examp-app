import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Exam = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Fetch questions on component mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !submitting) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      // Auto-submit when time runs out
      handleSubmit(true);
    }
  }, [timeRemaining, submitting]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/exam/questions?count=10');
      setQuestions(response.data.questions);
      setTimeRemaining(response.data.examDuration * 60); // Convert minutes to seconds
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('Failed to load exam questions. Please try again.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (submitting) return;

    const confirmMessage = autoSubmit 
      ? 'Time is up! Your exam will be submitted automatically.'
      : 'Are you sure you want to submit your exam? You cannot change your answers after submission.';

    if (!autoSubmit && !window.confirm(confirmMessage)) {
      return;
    }

    setSubmitting(true);

    try {
      // Format answers for submission
      const formattedAnswers = questions.map(question => ({
        questionId: question._id,
        selectedOption: answers[question._id] !== undefined ? answers[question._id] : -1
      }));

      const timeSpent = 1800 - timeRemaining; // Calculate time spent

      const response = await axios.post('/api/exam/submit', {
        answers: formattedAnswers,
        timeSpent
      });

      // Navigate to result page
      navigate(`/result/${response.data.result.id}`);
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Failed to submit exam. Please try again.');
      setSubmitting(false);
    }
  }, [answers, questions, timeRemaining, navigate, submitting]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining <= 300) return '#dc3545'; // Red for last 5 minutes
    if (timeRemaining <= 600) return '#ffc107'; // Yellow for last 10 minutes
    return '#28a745'; // Green otherwise
  };

  if (loading) {
    return (
      <div className="exam-container">
        <div className="loading">Loading exam questions...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="exam-container">
        <div className="card text-center">
          <h3>No questions available</h3>
          <p>Please contact your administrator.</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestion._id];

  return (
    <div className="exam-container">
      {/* Exam Header */}
      <div className="exam-header">
        <div className="exam-progress">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="exam-timer" style={{ color: getTimerColor() }}>
          Time Remaining: {formatTime(timeRemaining)}
        </div>
      </div>

      {/* Question Card */}
      <div className="question-card card">
        <div className="question-header">
          <div className="question-number">
            Q{currentQuestionIndex + 1}
          </div>
          {currentQuestion.category && (
            <div style={{ 
              backgroundColor: '#e9ecef', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '12px',
              fontSize: '0.8rem',
              color: '#666'
            }}>
              {currentQuestion.category}
            </div>
          )}
        </div>

        <div className="question-text">
          {currentQuestion.question}
        </div>

        <ul className="options-list">
          {currentQuestion.options.map((option, index) => (
            <li key={index} className="option-item">
              <button
                className={`option-button ${selectedAnswer === index ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(currentQuestion._id, index)}
                disabled={submitting}
              >
                <span style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>
                  {String.fromCharCode(65 + index)}.
                </span>
                {option.text}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Navigation */}
      <div className="exam-navigation">
        <button 
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0 || submitting}
          className="btn btn-secondary"
        >
          Previous
        </button>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className="btn btn-success"
          >
            {submitting ? 'Submitting...' : 'Submit Exam'}
          </button>

          {currentQuestionIndex < questions.length - 1 && (
            <button 
              onClick={handleNext}
              disabled={submitting}
              className="btn btn-primary"
            >
              Next
            </button>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="card" style={{ marginTop: '1rem' }}>
        <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Progress: {Object.keys(answers).length} of {questions.length} answered
        </div>
        <div style={{ 
          width: '100%', 
          height: '8px', 
          backgroundColor: '#e9ecef', 
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(Object.keys(answers).length / questions.length) * 100}%`,
            height: '100%',
            backgroundColor: '#007bff',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>
    </div>
  );
};

export default Exam;
