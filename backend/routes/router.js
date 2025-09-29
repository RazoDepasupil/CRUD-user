import { Router } from "express";
import User from "../schemas/model.js";
import validationSchema from "../utils/validationSchema.js";
import { checkSchema, matchedData, validationResult } from "express-validator";
import hashPassword, { compareHashed } from "../utils/crypting.js";

import "../strategies/local-strategy.js";

const router = Router();

router.post("/register", checkSchema(validationSchema), async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(400).json({ success: false, errors: result.array() });

  const data = matchedData(req);
  data.password = hashPassword(data.password);
  const newUser = new User(data);

  try {
    const savedUser = await newUser.save();
    const userSafe = savedUser.toObject();
    delete userSafe.password;
    res.status(201).json({
      success: true,
      user: userSafe,
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Username already exists",
      });
    }

    res.status(400).json({
      success: false,
      error: "Registration failed. Please try again.",
    });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, error: "All fields are required" });

  try {
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(400)
        .json({ success: false, error: "Invalid Credential" });

    const isMatched = compareHashed(password, user.password);
    if (!isMatched)
      return res
        .status(400)
        .json({ success: false, error: "Invalid Credential" });

    req.session.userId = user._id;
    return res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.status(500).json({ success: false, error: "Couldn't Logout" });
    return res
      .status(200)
      .json({ success: true, message: "Logout Successfully" });
  });
});

router.get("/users", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  try {
    const users = await User.find().select("-password"); // exclude password
    console.log(users);
    return res.status(200).json({ success: true, users:users, currentUserId: req.session.userId.toString(), });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

router.patch("/update", async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ success: false, error: "Unauthorized" });

  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, error: "All fields are required" });

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.session.userId },
      { username, password: hashPassword(password) },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

router.delete("/delete/:_id", async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ success: false, error: "Unauthorized" });
  try {
    const { _id } = req.params;
    const deleteUser = await User.findByIdAndDelete(_id);
    if (!deleteUser)
      return res.status(404).json({ success: false, error: "User not found" });
    if (req.session.userId.toString() ===  _id.toString()) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destroy error:", err);
        }
        res.clearCookie("connect.sid",{path:"/"});
        return res.json({ success: true, selfDelete: true });
      });
    } else {
      return res.status(200).json({ success: true, selfDelete: false, deleteUser });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
