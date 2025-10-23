// models/ForumQuestion.js
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  userId: String,
  text: String,
  language: String,
  upvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const forumQuestionSchema = new mongoose.Schema({
  userId: String,
  title: String,
  text: String,
  language: String,
  images: [String],
  upvotes: { type: Number, default: 0 },
  answers: [answerSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ForumQuestion', forumQuestionSchema);
