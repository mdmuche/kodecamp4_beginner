var express = require("express");
const { quizModel } = require("../models/quizModel");
const verifyAuth = require("../middleware/verifyAuth");
const { activeQuizModel } = require("../models/activeQuizModel");
const { quizHistoryModel } = require("../models/quizHistory");
const rolesAllowed = require("../middleware/roleBasedAuth");
var router = express.Router();

router.use(verifyAuth);
router.use(rolesAllowed(["users"]));

router.get("/quiz/:quizNumber", function (req, res, next) {
  const { quizNumber } = req.params;
  const quiz = quizModel.findOne({ questionNumber: quizNumber });

  res.send({ quiz });
});

router.post("/answer-a-question", async function (req, res, next) {
  const { quiz, optionChosen } = req.body;

  await activeQuizModel.create({
    quiz,
    optionChosen,
    user: req.userDetails.userId,
  });

  res.send({ message: "Answer recorded" });
});

router.post("/mark-quiz", async function (req, res, next) {
  const activeQuiz = await activeQuizModel
    .find({ user: req.userDetails.userId })
    .populate("quiz", "-qustionNumber");

  let totalMarks = 0;
  let totalAnsweredQuestion = activeQuiz.length;

  let totalCorrectQuestion = 0;
  let totalIncorrectQuestion = 0;

  for (let question of activeQuiz) {
    if (question.quiz.correctOption == question.optionChosen) {
      totalMarks += 10;
      totalCorrectQuestion++;
    } else {
      totalIncorrectQuestion++;
    }
  }

  await quizHistoryModel.create({
    score: totalMarks,
    questions: activeQuiz,
    totalCorrectQuestion: totalCorrectQuestion,
    totalIncorrectQuestion: totalIncorrectQuestion,
    user: req.userDetails.userId,
  });

  await activeQuizModel.deleteMany({ user: req.userDetails.userId });

  res.send({
    totalMarks,
    totalAnsweredQuestion,
    totalCorrectQuestion,
    totalIncorrectQuestion,
  });
});

module.exports = router;
