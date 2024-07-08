var express = require("express");
const { quizModel } = require("../models/quizModel");
var router = express.Router();
const verifyAuth = require("../middleware/verifyAuth");
const rolesAllowed = require("../middleware/roleBasedAuth");

router.use(verifyAuth);
router.use(rolesAllowed(["admins"]));

router.post("/quiz", async function (req, res, next) {
  const { question, optionA, optionB, optionC, optionD, correctOption } =
    req.body;
  await quizModel.create({
    question,
    questionNumber,
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

module.exports = router;
