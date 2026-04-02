const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../data/store");

const router = express.Router();

const serializeUser = (user) => ({
  id: (user.id || user._id).toString(),
  name: user.name,
  email: user.email,
  createdAt: user.createdAt
});

const createToken = (user) =>
  jwt.sign(
    {
      sub: (user.id || user._id).toString(),
      email: user.email,
      name: user.name
    },
    process.env.JWT_SECRET || "dev-secret-change-me",
    { expiresIn: "7d" }
  );

router.post("/signup", async (req, res) => {
  try {
    const name = req.body?.name?.trim();
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long."
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        message: "An account with that email already exists."
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, passwordHash });
    const token = createToken(user);

    return res.status(201).json({ token, user: serializeUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with that email already exists."
      });
    }

    return res.status(500).json({
      message: "Unable to create account right now."
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required."
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const token = createToken(user);

    return res.json({
      token,
      user: serializeUser(user)
    });
  } catch (_error) {
    return res.status(500).json({
      message: "Unable to log in right now."
    });
  }
});

module.exports = router;
