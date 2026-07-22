const request=require("supertest");

const bcrypt=require("bcryptjs");

const jwt=require("jsonwebtoken");

const app=require("../app");

const User=require("../models/User");

jest.mock("../models/User");

jest.mock("bcryptjs");

jest.mock("jsonwebtoken");

describe("Authentication APIs",()=>{

beforeEach(()=>{

jest.clearAllMocks();

});

describe("Register API",()=>{

test("Register Successfully",async()=>{

User.findOne.mockResolvedValue(null);

bcrypt.hash.mockResolvedValue("hashedPassword");

User.create.mockResolvedValue({

_id:"1",

username:"raj",

role:"Reader"

});

const response=await request(app)

.post("/api/auth/register")

.send({

username:"raj",

password:"123",

confirmpassword:"123"

});

expect(response.status).toBe(201);

expect(User.findOne).toHaveBeenCalled();

expect(User.create).toHaveBeenCalled();

expect(bcrypt.hash).toHaveBeenCalled();

});

test("Username Already Exists",async()=>{

User.findOne.mockResolvedValue({

username:"raj"

});

const response=await request(app)

.post("/api/auth/register")

.send({

username:"raj",

password:"123",

confirmpassword:"123"

});

expect(response.status).toBe(400);

expect(response.body.message)

.toBe("Username already exists.");

});

});

describe("Login API",()=>{

test("Login Success",async()=>{

User.findOne.mockResolvedValue({

_id:"1",

username:"raj",

password:"hashed",

role:"Reader"

});

bcrypt.compare.mockResolvedValue(true);

jwt.sign.mockReturnValue("jwt-token");

const response=await request(app)

.post("/api/auth/login")

.send({

username:"raj",

password:"123"

});

expect(response.status).toBe(200);

expect(response.body.token)

.toBe("jwt-token");

expect(response.body.user.username)

.toBe("raj");

});

test("Invalid Username",async()=>{

User.findOne.mockResolvedValue(null);

const response=await request(app)

.post("/api/auth/login")

.send({

username:"wrong",

password:"123"

});

expect(response.status).toBe(400);

});

test("Wrong Password",async()=>{

User.findOne.mockResolvedValue({

username:"raj",

password:"hashed"

});

bcrypt.compare.mockResolvedValue(false);

const response=await request(app)

.post("/api/auth/login")

.send({

username:"raj",

password:"wrong"

});

expect(response.status).toBe(400);

});

});

});