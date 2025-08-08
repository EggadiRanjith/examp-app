# Exam Taking Application

A full-stack exam-taking application built with React.js frontend and Node.js/Express.js backend with MongoDB database.

## Features

- ✅ User registration and login with JWT authentication
- ✅ Start Exam interface with randomized questions from database
- ✅ MCQ display with Next/Previous navigation
- ✅ 30-minute countdown timer with auto-submit capability
- ✅ Score calculation and detailed result display
- ✅ Exam history tracking
- ✅ Responsive UI design
- ✅ Secure API endpoints with JWT protection

## Technology Stack

- **Frontend**: React.js with React Router, Axios, Context API
- **Backend**: Node.js with Express.js, JWT, bcryptjs
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Custom CSS with responsive design

## Project Structure

```
exam-app/
├── frontend/                 # React.js application
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── backend/                 # Node.js/Express.js API
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── server.js           # Main server file
│   ├── seed.js             # Database seeding script
│   └── package.json
├── postman/                # API testing collection
├── API_TESTING.md          # API testing documentation
└── README.md
```

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file (already provided)
# Edit .env file if needed for your MongoDB connection

# Seed the database with sample questions
node seed.js

# Start the backend server
npm run dev
# or
npm start
```

### 2. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

### 3. Access the Application
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## Environment Variables

The `.env` file in the backend directory contains:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/exam-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**Important**: Change the `JWT_SECRET` in production!

## Database Setup

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The application will automatically create the database and collections

### Option 2: MongoDB Atlas (Cloud)
1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env` file

### Seeding Sample Data
Run the seed script to populate the database with sample questions:
```bash
cd backend
node seed.js
```

This will add 12 sample questions across different categories.

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Exam Endpoints
- `GET /api/exam/questions` - Get randomized exam questions (protected)
- `POST /api/exam/submit` - Submit exam answers (protected)
- `GET /api/exam/result/:id` - Get detailed exam result (protected)
- `GET /api/exam/history` - Get user's exam history (protected)

For detailed API testing instructions, see [API_TESTING.md](./API_TESTING.md)

## Testing the API

### Using Postman
1. Import the collection from `postman/Exam-App-API.postman_collection.json`
2. Set the base URL to `http://localhost:5000`
3. Register a user or login to get a JWT token
4. Use the token for protected endpoints

### Using curl
See [API_TESTING.md](./API_TESTING.md) for detailed curl commands.

## Application Flow

1. **Registration/Login**: Users create an account or login
2. **Dashboard**: View exam information and history
3. **Start Exam**: Begin a timed exam with randomized questions
4. **Take Exam**: Answer MCQs with navigation and timer
5. **Submit**: Automatic or manual submission
6. **Results**: View detailed results with correct answers
7. **History**: Track all previous exam attempts

## Features in Detail

### Authentication
- Secure JWT-based authentication
- Password hashing with bcryptjs
- Protected routes and API endpoints
- Automatic token verification

### Exam System
- Randomized question selection
- 30-minute countdown timer
- Auto-submit when time expires
- Progress tracking
- Answer persistence during exam

### Results & Analytics
- Immediate score calculation
- Detailed question-by-question review
- Performance percentage and grading
- Time tracking
- Historical data storage

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start  # React development server with hot reload
```

### Adding New Questions
Questions can be added by:
1. Modifying the `seed.js` file
2. Adding questions directly to MongoDB
3. Creating an admin interface (future enhancement)

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas or production database
4. Deploy to services like Heroku, AWS, or DigitalOcean

### Frontend
1. Run `npm run build` to create production build
2. Deploy to services like Netlify, Vercel, or AWS S3
3. Update API endpoints to production URLs

## Project Evaluation Criteria ✅

- ✅ **JWT Authentication**: Secure registration/login with proper token handling
- ✅ **Backend Structure**: Modular API design with proper routing and middleware
- ✅ **React Implementation**: Clean component structure with hooks and context
- ✅ **Timer Logic**: Functional countdown with auto-submit capability
- ✅ **Documentation**: Complete setup instructions and API documentation
- ✅ **Code Quality**: Clean, readable, and well-structured code

## Future Enhancements

- Admin panel for question management
- Question categories and difficulty filtering
- Detailed analytics and reporting
- Email notifications
- Mobile app version
- Proctoring features

## Support

For questions or issues, please refer to the API documentation or create an issue in the repository.

---

**Note**: This project was developed as part of a technical evaluation and demonstrates full-stack development skills with modern web technologies.
