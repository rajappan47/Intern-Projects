const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app");
const User = require("../models/User");

jest.mock("../models/User");

describe("Users API", () => {

  let adminToken;
  let readerToken;

  beforeAll(() => {
    process.env.JWT_SECRET = "test_secret";

    adminToken = jwt.sign(
      { id: "1", username: "admin", role: "Admin" },
      process.env.JWT_SECRET
    );

    readerToken = jwt.sign(
      { id: "2", username: "reader", role: "Reader" },
      process.env.JWT_SECRET
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/users", () => {

    test("Admin can view all users", async () => {

      User.find.mockResolvedValue([
        {
          _id: "1",
          username: "admin",
          role: "Admin"
        },
        {
          _id: "2",
          username: "raj",
          role: "Reader"
        }
      ]);

      const response = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(User.find).toHaveBeenCalled();
      expect(response.body.length).toBe(2);

    });

    test("Reader cannot view users", async () => {

      const response = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${readerToken}`);

      expect(response.status).toBe(403);

    });

  });

  describe("PUT /api/users/:id/role", () => {

    test("Admin updates role", async () => {

      User.findByIdAndUpdate.mockResolvedValue({
        _id: "2",
        username: "raj",
        role: "Member"
      });

      const response = await request(app)
        .put("/api/users/2/role")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          role: "Member"
        });

      expect(response.status).toBe(200);
      expect(response.body.user.role).toBe("Member");

    });

    test("Invalid role", async () => {

      const response = await request(app)
        .put("/api/users/2/role")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          role: "Student"
        });

      expect(response.status).toBe(400);

    });

  });

});