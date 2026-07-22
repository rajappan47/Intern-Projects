const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app");
const Book = require("../models/Book");

jest.mock("../models/Book");

describe("Books API Tests", () => {
  let adminToken;
  let memberToken;
  let readerToken;

  beforeAll(() => {
    process.env.JWT_SECRET = "test_secret";

    adminToken = jwt.sign(
      { id: "1", username: "admin", role: "Admin" },
      process.env.JWT_SECRET
    );

    memberToken = jwt.sign(
      { id: "2", username: "member", role: "Member" },
      process.env.JWT_SECRET
    );

    readerToken = jwt.sign(
      { id: "3", username: "reader", role: "Reader" },
      process.env.JWT_SECRET
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==========================
  // GET BOOKS
  // ==========================

  describe("GET /api/books", () => {
    test("Reader should get all books", async () => {
      Book.find.mockResolvedValue([
        {
          _id: "1",
          title: "Java", 
          author: "James"
        },
        {
          _id: "2",
          title: "NodeJS",
          author: "Ryan"
        }
      ]);

      const response = await request(app)
        .get("/api/books")
        .set("Authorization", `Bearer ${readerToken}`);

      expect(response.status).toBe(200);
      expect(Book.find).toHaveBeenCalled();
      expect(response.body.length).toBe(2);
      expect(response.body[0].title).toBe("Java");
    });

    test("Should return 401 if token missing", async () => {
      const response = await request(app)
        .get("/api/books");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe(
        "Access denied. Token missing."
      );
    });

    test("Should return 403 for invalid token", async () => {
      const response = await request(app)
        .get("/api/books")
        .set("Authorization", "Bearer invalidtoken");

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "Invalid authentication token."
      );
    });
  });

  // ==========================
  // CREATE BOOK
  // ==========================

  describe("POST /api/books", () => {
    test("Admin can create book", async () => {
      Book.create.mockResolvedValue({
        _id: "10",
        title: "Express",
        author: "TJ"
      });

      const response = await request(app)
        .post("/api/books")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "Express",
          author: "TJ"
        });

      expect(response.status).toBe(201);
      expect(Book.create).toHaveBeenCalled();
      expect(response.body.title).toBe("Express");
    });

    test("Member can create book", async () => {
      Book.create.mockResolvedValue({
        _id: "11",
        title: "MongoDB",
        author: "Mongo Inc"
      });

      const response = await request(app)
        .post("/api/books")
        .set("Authorization", `Bearer ${memberToken}`)
        .send({
          title: "MongoDB",
          author: "Mongo Inc"
        });

      expect(response.status).toBe(201);
    });

    test("Reader cannot create book", async () => {
      const response = await request(app)
        .post("/api/books")
        .set("Authorization", `Bearer ${readerToken}`)
        .send({
          title: "Book",
          author: "Author"
        });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "Unauthorized access. Insufficient permissions."
      );
    });
  });

  // ==========================
  // UPDATE BOOK
  // ==========================

  describe("PUT /api/books/:id", () => {
    test("Admin updates book", async () => {
      Book.findByIdAndUpdate.mockResolvedValue({
        _id: "1",
        title: "Updated Java",
        author: "James"
      });

      const response = await request(app)
        .put("/api/books/1")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "Updated Java",
          author: "James"
        });

      expect(response.status).toBe(200);
      expect(Book.findByIdAndUpdate).toHaveBeenCalled();
      expect(response.body.title).toBe("Updated Java");
    });

    test("Book not found", async () => {
      Book.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put("/api/books/100")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "ABC",
          author: "XYZ"
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Book not found.");
    });

    test("Reader cannot update", async () => {
      const response = await request(app)
        .put("/api/books/1")
        .set("Authorization", `Bearer ${readerToken}`)
        .send({
          title: "Book"
        });

      expect(response.status).toBe(403);
    });
  });

  // ==========================
  // DELETE BOOK
  // ==========================

  describe("DELETE /api/books/:id", () => {
    test("Admin deletes book", async () => {
      Book.findByIdAndDelete.mockResolvedValue({
        _id: "1"
      });

      const response = await request(app)
        .delete("/api/books/1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Book.findByIdAndDelete).toHaveBeenCalled();
      expect(response.body.message).toBe(
        "Book deleted successfully."
      );
    });

    test("Delete book not found", async () => {
      Book.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app)
        .delete("/api/books/50")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Book not found.");
    });

    test("Reader cannot delete book", async () => {
      const response = await request(app)
        .delete("/api/books/1")
        .set("Authorization", `Bearer ${readerToken}`);

      expect(response.status).toBe(403);
    });
  });
});