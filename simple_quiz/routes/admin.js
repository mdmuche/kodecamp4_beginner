var express = require("express");
const { quizModel } = require("../models/quizModel");
var router = express.Router();
const verifyAuth = require("../middleware/verifyAuth");
const rolesAllowed = require("../middleware/roleBasedAuth");

router.use(verifyAuth);
router.use(rolesAllowed(["admin"]));

router.post("/quiz", async function (req, res, next) {
  const {
    questionNumber,
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctOption,
  } = req.body;

  await quizModel.create({
    questionNumber,
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctOption,
  });

  res.status(201).send({
    message: "quiz created",
  });
});

router.get("/quiz/:page/:limit", async (req, res, next) => {
  const { page, limit } = req.params;
  const quizList = await quizModel.paginate({}, { page, limit });

  res.send({ quizList });
});

router.get("/quiz-by-id/:id", async (req, res, next) => {
  const { id } = req.params;
  const quiz = await quizModel.findById(id);

  res.send({ quiz });
});

router.put("/quiz/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      questionNumber,
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
    } = req.body;

    const updatedQuiz = await quizModel.findByIdAndUpdate(
      id,
      {
        questionNumber,
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctOption,
      },
      { new: true }
    );

    res.send({ message: "quiz updated successfully!", updatedQuiz });
  } catch (err) {
    console.error("an error occurred", err.message);
    next(err);
  }
});

module.exports = router;
