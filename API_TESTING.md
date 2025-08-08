# API Testing Guide

This document provides instructions for testing the Exam App API endpoints using curl commands or Postman.

## Base URL
```
http://localhost:5000
```

## Authentication Endpoints

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 2. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 3. Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## Exam Endpoints

### 4. Get Exam Questions
```bash
curl -X GET "http://localhost:5000/api/exam/questions?count=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "questions": [
    {
      "_id": "question_id",
      "question": "What is the capital of France?",
      "options": [
        {"index": 0, "text": "London"},
        {"index": 1, "text": "Berlin"},
        {"index": 2, "text": "Paris"},
        {"index": 3, "text": "Madrid"}
      ],
      "category": "Geography",
      "difficulty": "Easy"
    }
  ],
  "totalQuestions": 10,
  "examDuration": 30
}
```

### 5. Submit Exam
```bash
curl -X POST http://localhost:5000/api/exam/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "answers": [
      {
        "questionId": "QUESTION_ID_1",
        "selectedOption": 2
      },
      {
        "questionId": "QUESTION_ID_2",
        "selectedOption": 1
      }
    ],
    "timeSpent": 900
  }'
```

**Expected Response:**
```json
{
  "message": "Exam submitted successfully",
  "result": {
    "id": "result_id",
    "score": 8,
    "totalQuestions": 10,
    "percentage": 80,
    "timeSpent": 900,
    "completedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### 6. Get Exam Result
```bash
curl -X GET http://localhost:5000/api/exam/result/RESULT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "result": {
    "id": "result_id",
    "score": 8,
    "totalQuestions": 10,
    "percentage": 80,
    "timeSpent": 900,
    "completedAt": "2024-01-01T12:00:00.000Z",
    "questions": [
      {
        "question": "What is the capital of France?",
        "options": ["London", "Berlin", "Paris", "Madrid"],
        "selectedOption": 2,
        "correctOption": 2,
        "isCorrect": true
      }
    ]
  }
}
```

### 7. Get Exam History
```bash
curl -X GET http://localhost:5000/api/exam/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "results": [
    {
      "_id": "result_id",
      "score": 8,
      "totalQuestions": 10,
      "percentage": 80,
      "timeSpent": 900,
      "completedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

## Error Responses

### Authentication Errors
```json
{
  "message": "No token, authorization denied"
}
```

### Validation Errors
```json
{
  "errors": [
    {
      "msg": "Please enter a valid email",
      "param": "email"
    }
  ]
}
```

### Server Errors
```json
{
  "message": "Server error during registration"
}
```

## Testing Workflow

1. **Register a new user** or **login** to get a JWT token
2. **Save the token** from the response for subsequent requests
3. **Get exam questions** to start an exam
4. **Submit exam answers** with the question IDs and selected options
5. **Get the exam result** using the result ID from submission
6. **View exam history** to see all previous attempts

## Postman Collection

Import the `postman/Exam-App-API.postman_collection.json` file into Postman for easier testing. The collection includes:

- Pre-configured requests for all endpoints
- Automatic token extraction and storage
- Environment variables for base URL and token
- Test scripts for response validation

## Notes

- All protected endpoints require the `Authorization: Bearer <token>` header
- Tokens expire after 24 hours
- Question IDs in the submit request must match the IDs from the get questions response
- Selected option indices are 0-based (0, 1, 2, 3 for A, B, C, D respectively)
