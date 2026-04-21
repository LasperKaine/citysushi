const bcrypt = require(bcrypt);
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports = {
  registerUser: async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const existing = await User.findUserByEmail(email);
      if (existing) {
        return res.status(409).json({ message: "Email already registered" });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const userId = await User.createUser(
        name,
        email,
        phone || null,
        passwordHash,
      );

      return res.status(201).json({ message: "User registered", userId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const match = await bcrypt.compare(password, user.password_hash);

      if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },
};
