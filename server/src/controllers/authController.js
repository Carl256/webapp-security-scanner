//
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

// Import the User model
const User = require("../models/users");

const register = async function (req, res) {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract the email and password from the request body
  const { email, password } = req.body;

  // create a new user object
  const newUser = new User({
    email,
    password,
  });

  try {
    // Check if the user already exists
    const { email, password } = newUser;

    const existingUser = await User.findOne({
      email: email,
      password: password,
    }).then((user) => {
      user;
    });

    if (existingUser) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }
    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = new User({ email, password: hashedPassword });
    await user.save();

    // Return a JWT token for the new user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ errors: [{ msg: "Server error is" }] });
  }
};

const logIn = async function (req, res) {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Extract the email and password from the request body
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email: email }).then((user) => {
      // if the user email is found, return the user object
      return user;
    });

    if (!user) {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }


    const isMatch = await bcrypt.genSalt(10).then((salt) => {
      // get password from user object
      const { password } = user;
      return bcrypt.hash(password, salt).then((hashedPassword) => {
        return bcrypt.compare(password, hashedPassword);
      });
    });

    if (!isMatch) {
      return res.status(401).json({ errors: [{ msg: "Invalid password" }] });
    }

    if ( isMatch ) {
      // Return a JWT token for the authenticated user
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.json({ token });

      return res.status(200).json({ message: "Logged in successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

const logOut = async function (req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    const deletedToken = await Token.findOneAndDelete({ token: refreshToken });
    if (!deletedToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const changePassword = async function (req, res) {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  // Check if current password matches
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  // Hash and save new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  res.json({ message: "Password updated successfully" });
};

const resetPassword = async function (req, res) {
  try {
    const { email } = req.body;

    // Check if user with given email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a new random password
    const newPassword = generator.generate({
      length: 10,
      numbers: true,
      symbols: true,
      uppercase: true,
      excludeSimilarCharacters: true,
    });

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password in the database
    await User.updateOne({ email }, { password: hashedPassword });

    // Send the new password to the user's email
    await sendEmail({
      to: email,
      subject: "Password reset",
      text: `Your new password is ${newPassword}. Please log in to your account and change it as soon as possible.`,
    });

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  register,
  logIn,
  logOut,
  changePassword,
  resetPassword,
};
