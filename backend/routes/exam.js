const express = require('express');
const Question = require('../models/Question');
const ExamResult = require('../models/ExamResult');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/exam/questions
// @desc    Get randomized questions for exam
// @access  Private
router.get('/questions', auth, async (req, res) => {
  try {
    const questionCount = parseInt(req.query.count) || 10;
    
    // Get random questions from database
    const questions = await Question.aggregate([
      { $sample: { size: questionCount } }
    ]);

    // Remove correct answers from response (only send options without isCorrect flag)
    const questionsForExam = questions.map(question => ({
      _id: question._id,
      question: question.question,
      options: question.options.map((option, index) => ({
        index,
        text: option.text
      })),
      category: question.category,
      difficulty: question.difficulty
    }));

    res.json({
      questions: questionsForExam,
      totalQuestions: questionsForExam.length,
      examDuration: 30 // 30 minutes
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ message: 'Server error while fetching questions' });
  }
});

// @route   POST /api/exam/submit
// @desc    Submit exam and calculate score
// @access  Private
router.post('/submit', auth, async (req, res) => {
  try {
    const { answers, timeSpent } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid answers format' });
    }

    let score = 0;
    const questionResults = [];

    // Calculate score by checking each answer
    for (const answer of answers) {
      const question = await Question.findById(answer.questionId);
      if (!question) continue;

      const selectedOption = answer.selectedOption;
      const isCorrect = question.options[selectedOption]?.isCorrect || false;
      
      if (isCorrect) {
        score++;
      }

      questionResults.push({
        questionId: answer.questionId,
        selectedOption,
        isCorrect
      });
    }

    const totalQuestions = answers.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    // Save exam result
    const examResult = new ExamResult({
      userId: req.user._id,
      questions: questionResults,
      score,
      totalQuestions,
      percentage,
      timeSpent: timeSpent || 0
    });

    await examResult.save();

    res.json({
      message: 'Exam submitted successfully',
      result: {
        id: examResult._id,
        score,
        totalQuestions,
        percentage,
        timeSpent,
        completedAt: examResult.completedAt
      }
    });
  } catch (error) {
    console.error('Submit exam error:', error);
    res.status(500).json({ message: 'Server error while submitting exam' });
  }
});

// @route   GET /api/exam/result/:id
// @desc    Get exam result by ID
// @access  Private
router.get('/result/:id', auth, async (req, res) => {
  try {
    const examResult = await ExamResult.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('questions.questionId');

    if (!examResult) {
      return res.status(404).json({ message: 'Exam result not found' });
    }

    // Format result with question details
    const detailedResult = {
      id: examResult._id,
      score: examResult.score,
      totalQuestions: examResult.totalQuestions,
      percentage: examResult.percentage,
      timeSpent: examResult.timeSpent,
      completedAt: examResult.completedAt,
      questions: examResult.questions.map(q => ({
        question: q.questionId.question,
        options: q.questionId.options.map(opt => opt.text),
        selectedOption: q.selectedOption,
        correctOption: q.questionId.options.findIndex(opt => opt.isCorrect),
        isCorrect: q.isCorrect
      }))
    };

    res.json({ result: detailedResult });
  } catch (error) {
    console.error('Get result error:', error);
    res.status(500).json({ message: 'Server error while fetching result' });
  }
});

// @route   GET /api/exam/history
// @desc    Get user's exam history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const results = await ExamResult.find({ userId: req.user._id })
      .select('-questions')
      .sort({ completedAt: -1 })
      .limit(10);

    res.json({ results });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Server error while fetching history' });
  }
});

module.exports = router;
