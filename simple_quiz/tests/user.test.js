const app = require("../bin/www");
const mongoose = require("mongoose");

const request = require("supertest");

const { activeQuizModel } = require("../models/activeQuizModel");

beforeAll(async () => {
  await activeQuizModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  app.close();
});

let userToken = "";
let questionOneId = "";
let questionTwoId = "";

describe("Tests for user's route", () => {
  test("Login the user", async () => {
    const response = await request(app).post("/v1/auth/login").send({
      email: "johndoe@gmail.com",
      password: "test123",
    });
    userToken = response.body.token;

    expect(response.status).toBe(200);
  });

  test("Get question number 1", async () => {
    const response = await request(app)
      .get("/v1/users/quiz/1")
      .set("Authorization", `Bearer ${userToken}`);

    questionOneId = response.body.quiz._id;

    expect(response.status).toBe(200);
    expect(response.body.quiz.question).toBe("a baby cow is called");
  });

  test("Answer question one", async () => {
    const response = await request(app)
      .post("/v1/users/answer-a-question")
      .send({
        quiz: questionOneId,
        optionChosen: "optionB",
      })
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Answer recorded");
  });

  test("Get question number 2", async () => {
    const response = await request(app)
      .get("/v1/users/quiz/2")
      .set("Authorization", `Bearer ${userToken}`);

    questionTwoId = response.body.quiz._id;

    expect(response.status).toBe(200);
    expect(response.body.quiz.question).toBe(
      "the full meaning of W.H.O is ________"
    );
  });

  test("Answer question two", async () => {
    const response = await request(app)
      .post("/v1/users/answer-a-question")
      .send({
        quiz: questionTwoId,
        optionChosen: "optionA",
      })
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Answer recorded");
  });

  test("Mark a quiz", async () => {
    const response = await request(app)
      .post("/v1/users//mark-quiz")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.totalMarks).toBe(20);
    expect(response.body.totalAnsweredQuestion).toBe(2);
    expect(response.body.totalCorrectQuestion).toBe(2);
    expect(response.body.totalIncorrectQuestion).toBe(0);
  });
});
