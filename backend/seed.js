const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question');

dotenv.config();

const sampleQuestions = [
  {
    question: "What is the capital of France?",
    options: [
      { text: "London", isCorrect: false },
      { text: "Berlin", isCorrect: false },
      { text: "Paris", isCorrect: true },
      { text: "Madrid", isCorrect: false }
    ],
    category: "Geography",
    difficulty: "Easy"
  },
  {
    question: "Which programming language is known as the 'language of the web'?",
    options: [
      { text: "Python", isCorrect: false },
      { text: "JavaScript", isCorrect: true },
      { text: "Java", isCorrect: false },
      { text: "C++", isCorrect: false }
    ],
    category: "Programming",
    difficulty: "Easy"
  },
  {
    question: "What is the largest planet in our solar system?",
    options: [
      { text: "Earth", isCorrect: false },
      { text: "Mars", isCorrect: false },
      { text: "Jupiter", isCorrect: true },
      { text: "Saturn", isCorrect: false }
    ],
    category: "Science",
    difficulty: "Easy"
  },
  {
    question: "Which HTTP method is used to update a resource?",
    options: [
      { text: "GET", isCorrect: false },
      { text: "POST", isCorrect: false },
      { text: "PUT", isCorrect: true },
      { text: "DELETE", isCorrect: false }
    ],
    category: "Programming",
    difficulty: "Medium"
  },
  {
    question: "What is the time complexity of binary search?",
    options: [
      { text: "O(n)", isCorrect: false },
      { text: "O(log n)", isCorrect: true },
      { text: "O(n²)", isCorrect: false },
      { text: "O(1)", isCorrect: false }
    ],
    category: "Computer Science",
    difficulty: "Medium"
  },
  {
    question: "Which year did World War II end?",
    options: [
      { text: "1944", isCorrect: false },
      { text: "1945", isCorrect: true },
      { text: "1946", isCorrect: false },
      { text: "1947", isCorrect: false }
    ],
    category: "History",
    difficulty: "Easy"
  },
  {
    question: "What is the chemical symbol for gold?",
    options: [
      { text: "Go", isCorrect: false },
      { text: "Gd", isCorrect: false },
      { text: "Au", isCorrect: true },
      { text: "Ag", isCorrect: false }
    ],
    category: "Chemistry",
    difficulty: "Medium"
  },
  {
    question: "Which design pattern ensures a class has only one instance?",
    options: [
      { text: "Factory", isCorrect: false },
      { text: "Observer", isCorrect: false },
      { text: "Singleton", isCorrect: true },
      { text: "Strategy", isCorrect: false }
    ],
    category: "Programming",
    difficulty: "Medium"
  },
  {
    question: "What is the square root of 144?",
    options: [
      { text: "11", isCorrect: false },
      { text: "12", isCorrect: true },
      { text: "13", isCorrect: false },
      { text: "14", isCorrect: false }
    ],
    category: "Mathematics",
    difficulty: "Easy"
  },
  {
    question: "Which continent is the largest by area?",
    options: [
      { text: "Africa", isCorrect: false },
      { text: "Asia", isCorrect: true },
      { text: "North America", isCorrect: false },
      { text: "Europe", isCorrect: false }
    ],
    category: "Geography",
    difficulty: "Easy"
  },
  {
    question: "What does CSS stand for?",
    options: [
      { text: "Computer Style Sheets", isCorrect: false },
      { text: "Cascading Style Sheets", isCorrect: true },
      { text: "Creative Style Sheets", isCorrect: false },
      { text: "Colorful Style Sheets", isCorrect: false }
    ],
    category: "Web Development",
    difficulty: "Easy"
  },
  {
    question: "Which data structure uses LIFO (Last In, First Out) principle?",
    options: [
      { text: "Queue", isCorrect: false },
      { text: "Array", isCorrect: false },
      { text: "Stack", isCorrect: true },
      { text: "Linked List", isCorrect: false }
    ],
    category: "Computer Science",
    difficulty: "Medium"
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('Cleared existing questions');

    // Insert sample questions
    await Question.insertMany(sampleQuestions);
    console.log(`Inserted ${sampleQuestions.length} sample questions`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
