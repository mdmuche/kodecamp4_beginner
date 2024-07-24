const app = require("../bin/www");
const mongoose = require("mongoose");

const request = require("supertest");

const { quizModel } = require("../models/quizModel");

let adminToken = "";
let quizId = "";

beforeAll(async () => {
  await quizModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  app.close();
});

describe("Testing admin route", () => {
  test("Login the admin", async () => {
    const response = await request(app).post("/v1/auth/login").send({
      email: "admindoe@gmail.com",
      password: "test123",
    });
    adminToken = response.body.token;

    expect(response.status).toBe(200);
  });

  test("Add a quiz", async () => {
    const response = await request(app)
      .post("/v1/admin/quiz")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        questionNumber: "1",
        question: "a baby cow is called",
        optionA: "milk",
        optionB: "calf",
        optionC: "tiger",
        optionD: "rabbit",
        correctOption: "optionB",
      });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("quiz created");
  });

  test("Add a second quiz", async () => {
    const response = await request(app)
      .post("/v1/admin/quiz")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        questionNumber: "2",
        question: "the full meaning of W.H.O is ________",
        optionA: "world health organization",
        optionB: "world happy organization",
        optionC: "wound, health and organism",
        optionD: "wall handle and opacity",
        correctOption: "optionA",
      });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("quiz created");
  });

  test("Get a list of quiz", async () => {
    const response = await request(app)
      .get("/v1/admin/quiz/1/10")
      .set("Authorization", `Bearer ${adminToken}`);

    quizId = response.body.quizList.docs[0]._id;

    expect(response.status).toBe(200);
    expect(typeof response.body.quizList).toBe("object");
  });

  test("Get quiz by id", async () => {
    const response = await request(app)
      .get("/v1/admin/quiz-by-id/" + quizId)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.quiz.question).toBe("a baby cow is called");
  });
});
