const mongoose = require("mongoose");

const quizHistorySchema = new mongoose.Schema(
  {
    score: {
      type: Number,
      required: true,
    },
    totalCorrectQuestion: {
      type: Number,
      required: true,
    },
    totalIncorrectQuestion: {
      type: Number,
      required: true,
    },
    questions: {
      type: Array,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

const quizHistoryModel = mongoose.model("quizHistory", quizHistorySchema);

module.exports = {
  quizHistoryModel,
};
