var express = require("express");
const { quizModel } = require("../models/quizModel");
const verifyAuth = require("../middleware/verifyAuth");
const { activeQuizModel } = require("../models/activeQuizModel");
const { quizHistoryModel } = require("../models/quizHistory");
const rolesAllowed = require("../middleware/roleBasedAuth");
var router = express.Router();

router.use(verifyAuth);
router.use(rolesAllowed(["user"]));

router.get("/emit-an-event", (req, res) => {
  try {
    req.io
      .to(req.userDetails.userId)
      .emit(
        "sample",
        "this is an event being fired on the (emit-an-event) route. this event is for: " +
          req.userDetails.fullName
      );

    res.send("event emitted");
  } catch (err) {
    console.error(err);
    res.status(500).send("internal server error");
  }
});

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

router.get("/unanswered-question-number", async (req, res, next) => {
  try {
    const answeredQuiz = await activeQuizModel
      .find({ user: req.userDetails.userId })
      .populate("quiz", "questionNumber");

    const answeredNumber = answeredQuiz.map((q) => q.quiz.questionNumber);
    const totalQuestions = await quizModel.countDocuments({});
    console.log(totalQuestions);
    const unAnsweredQuestion = [];

    for (let i = 1; i <= totalQuestions; i++) {
      if (answeredNumber.includes(i)) {
        unAnsweredQuestion.push({
          questionNumber: i,
          state: "answered",
        });
      } else {
        unAnsweredQuestion.push({
          questionNumber: i,
          state: "unanswered",
        });
      }
    }

    res.send({
      unAnsweredQuestion,
    });
  } catch (err) {
    console.error("an error ocured", err.message);
    next(err);
  }
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
    const result = await quizHistoryModel.paginate({
      user: req.userDetails.userId,
    });

    res.send({ result });
  } catch (err) {
    console.error("an error occured", err.message);
    next(err);
  }
});

router.get("/quiz-history/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await quizHistoryModel.findById(id);

    res.send({ result });
  } catch (err) {
    console.error("an error occured", err.message);
    next(err);
  }
});

module.exports = router;
