var express = require("express");
const { quizModel } = require("../models/quizModel");
const verifyAuth = require("../middleware/verifyAuth");
const { activeQuizModel } = require("../models/activeQuizModel");
const { quizHistoryModel } = require("../models/quizHistory");
const rolesAllowed = require("../middleware/roleBasedAuth");
var router = express.Router();

router.use(verifyAuth);
router.use(rolesAllowed(["user"]));

router.get("/quiz/:quizNumber", async function (req, res, next) {
  const { quizNumber: questionNumber } = req.params;
  const quiz = await quizModel.findOne(
    { questionNumber },
    "-correctOption -createdAt -updatedAt"
  );

  res.send({ quiz });
});

router.post("/answer-a-question", async function (req, res, next) {
  const { quiz, optionChosen } = req.body;

  const questionAlreadyAnswered = await activeQuizModel.exists({
    user: req.userDetails.userId,
    quiz,
  });

  if (questionAlreadyAnswered) {
    res
      .status(400)
      .send({ message: "this message has already been answered by you" });
    return;
  }

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

router.get("/quiz-history", async (req, res, next) => {
  try {
  } catch (err) {
    console.error("an error occured", err.message);
    next(err);
  }
});

module.exports = router;
