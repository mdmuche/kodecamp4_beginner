const app = require("../bin/www");
const mongoose = require("mongoose");

const request = require("supertest");
const { userModel } = require("../models/userModel");

beforeAll(async () => {
  await userModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  app.close();
});

describe("this set of code is going to test register and login for both admins and users", () => {
  test("Register a user", async () => {
    const response = await request(app).post("/v1/auth/register").send({
      fullName: "john doe",
      email: "johndoe@gmail.com",
      password: "test123",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("created user successfully!");
  });

  test("Register an admin", async () => {
    const response = await request(app).post("/v1/auth/register").send({
      fullName: "admin doe",
      email: "admindoe@gmail.com",
      password: "test123",
    });

    await userModel.findOneAndUpdate(
      { email: "admindoe@gmail.com" },
      {
        role: "admin",
      }
    );

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("created user successfully!");
  });

  test("Login a user", async () => {
    const response = await request(app).post("/v1/auth/login").send({
      email: "johndoe@gmail.com",
      password: "test123",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("loggin succesful, welcome");
    expect(response.body.userDetails).toBeTruthy();
    expect(response.body.userDetails.role).toBe("user");
    expect(response.body.token).toBeTruthy();
  });

  test("Login an admin", async () => {
    const response = await request(app).post("/v1/auth/login").send({
      email: "admindoe@gmail.com",
      password: "test123",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("loggin succesful, welcome");
    expect(response.body.userDetails).toBeTruthy();
    expect(response.body.userDetails.role).toBe("admin");
    expect(response.body.token).toBeTruthy();
  });
});
