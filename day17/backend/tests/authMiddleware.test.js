const jwt = require("jsonwebtoken");

const {
  verifyToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

describe("Auth Middleware", () => {

  beforeAll(() => {
    process.env.JWT_SECRET = "test_secret";
  });

  test("verifyToken should call next()", () => {

    const token = jwt.sign(
      {
        id: "1",
        role: "Admin"
      },
      process.env.JWT_SECRET
    );

    const req = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalled();

  });

  test("verifyToken should reject missing token", () => {

    const req = {
      headers: {}
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);

  });

  test("Admin should pass authorization", () => {

    const req = {
      user: {
        role: "Admin"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    authorizeRoles("Admin")(req, res, next);

    expect(next).toHaveBeenCalled();

  });

  test("Reader should fail Admin authorization", () => {

    const req = {
      user: {
        role: "Reader"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    authorizeRoles("Admin")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);

  });

});