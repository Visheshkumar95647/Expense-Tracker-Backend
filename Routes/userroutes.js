const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = require("../Models/User");
const dotenv = require("dotenv");
dotenv.config();

router.post("/register", async (req, res) => {
  console.log("Req is coming");
  try {
    const { firstname, lastname, email, password } = req.body;
    let user = await UserSchema.findOne({
      email: email,
    });

    // User Already Exist
    if (user) {
      return res
        .status(400)
        .json({ error: "User with these credentials already exists" });
    }

    // Hashing pass
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);
    user = await UserSchema.create({
      firstname: firstname,
      lastname: lastname,
      password: secPass,
      email: email,
    });

    // creating token
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.KEY,
      { expiresIn: "24h" }
    );
    res.status(200).json({ token: token });
  } catch (error) {
    console.error("Error caught:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserSchema.findOne({ email: email });

    // if not user exist
    if (!user) {
      return res.status(400).json("User with these details does not exist");
    }
    const secpassword = await bcrypt.compare(password, user.password);
    if (!secpassword) {
      return res.status(400).json("Incorrect password");
    }

    const token = jwt.sign(
      {
        id: user._id, 
      },
      process.env.KEY,
      { expiresIn: "24h" }
    );
    res.status(200).json({ token: token });
  } catch (error) {
    console.error("Error caught:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;