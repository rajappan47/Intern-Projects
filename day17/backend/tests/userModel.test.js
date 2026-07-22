const User = require("../models/User");

describe("User Model", () => {

  test("Default role should be Reader", () => {

    const user = new User({
      username: "raj",
      password: "123"
    });

    expect(user.role).toBe("Reader");

  });

  test("Username should exist", () => {

    const user = new User({
      username: "raj",
      password: "123"
    });

    expect(user.username).toBeDefined();

  });

  test("Password should exist", () => {

    const user = new User({
      username: "raj",
      password: "123"
    });

    expect(user.password).toBeDefined();

  });

  test("Role should accept Admin", () => {

    const user = new User({
      username: "admin",
      password: "123",
      role: "Admin"
    });

    expect(user.role).toBe("Admin");

  });

});