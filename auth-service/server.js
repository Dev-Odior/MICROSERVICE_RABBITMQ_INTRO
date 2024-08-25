const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const jwt = require("jsonwebtoken");

const { User } = require("./model/user.model.js");

const connectDB = require("./db/index.js");
const { JsonWebTokenError } = require("jsonwebtoken");

connectDB();

app.use(express.json());

app.post("/auth/register", async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.send(`Values missing check`);
    }

    const user = await User.findOne({ where: { email } });

    if (user) {
      return res.send(`User Already Exists`);
    }

    const payload = await User.create({ email, name, password });

    const token = jwt.sign(
      { name: payload.name, id: payload.id, email: payload.email },
      "secret",
      {
        expiresIn: "1d",
      }
    );

    return res.status(201).json({
      message: "user created successfully",
      payload,
      token,
    });
  } catch (error) {
    return res.send(`An error occurred ${error}`);
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send(`Values missing check`);
    }

    const payload = await User.findOne({ where: { email } });

    if (!payload) {
      return res.send("user does not exists");
    }

    if (password !== payload.password) {
      return res.send("email or password is not correct");
    }

    const token = jwt.sign(
      { name: payload.name, id: payload.id, email: payload.email },
      "secret",
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "user created successfully",
      payload,
      token,
    });
  } catch (error) {
    res.send(`There was an error ${error}`);
  }
});

app.listen(PORT, () => {
  console.log(`Auth Service at ${PORT}`);
});
