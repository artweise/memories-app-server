import { genSaltSync, hashSync, compareSync } from "bcrypt"; // Handles password encryption
import jwt from "jsonwebtoken"; // Handles password encryption

import { userHandler } from "../handlers/user.handler.js"; // Import the User handler in order to interact with the database
import { validEmailPattern, validPasswordPattern } from "../utilities/auth.utilities.js";

const createUser = async (req, res, next) => {
  const { email, password, username } = req.body;

  // Check if email or password or username are not provided (empty strings)
  if (email === "" || password === "" || username === "") {
    res.status(400).json({ message: "Provide email, password and username" });
  }
  // check if valid email
  if (!validEmailPattern.test(email)) {
    res.status(400).json({ message: "Provide a valid email address" });
  }
  // check if valid password
  if (!validPasswordPattern.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter",
    });
  }

  // How many rounds should bcrypt run the salt (default - 10 rounds)
  const saltRounds = 10;

  try {
    // Check the users collection if a user with the same email already exists
    const foundUser = await userHandler.findUserByEmail(email);
    if (foundUser) {
      res.status(400).json({ message: "User already exists." });
    }
    // If email is unique, proceed to hash the password
    const salt = genSaltSync(saltRounds);
    const hashedPassword = hashSync(password, salt);

    // Create the new user in the database
    const createdUser = await userHandler.createUser({
      email,
      password: hashedPassword,
      username,
    });

    // Deconstruct the newly created user object to omit the password
    // We should never expose passwords publicly
    const { email, username, _id } = createdUser;

    // Create a new object that doesn't expose the password
    const user = { email, username, _id };

    // Send a json response containing the user object
    res.status(201).json(user);
  } catch (err) {
    // In this case, we send error handling to the error handling middleware.
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password are not provided (empty strings)
  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password" });
  }
  try {
    // Check the users collection if a user with the same email exists
    const foundUser = await userHandler.findUserByEmail(email);
    if (!foundUser) {
      // If the user is not found, send an error response
      res.status(401).json({ message: "User not found" });
    }
    // Compare the provided password with the one saved in the database
    const passwordCorrect = compareSync(password, foundUser.password);
    if (passwordCorrect) {
      // Deconstruct the user object to omit the password
      const { _id, email, username } = foundUser;

      // Create an object that will be set as the token payload
      const payload = { _id, email, username };

      // Create a JSON Web Token and sign it
      const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "12h",
      });

      // Send the token as the response
      res.status(200).json({
        accessToken,
        _id,
        email,
        username,
        message: "Logged in successfully",
      });
    } else {
      res.status(401).json({ message: "Unable to authenticate the user" });
    }
  } catch (err) {
    // In this case, we send error handling to the error handling middleware.
    next(err);
  }
};

const verifyToken = async (req, res) => {
  // If JWT token is valid the payload gets decoded by the isAuthenticated middleware and now is available on `req.payload`
  console.log(`req.payload`, req.payload);

  // Send back the token payload object containing the user data
  res.status(200).json(req.payload);
};

export const authController = { createUser, loginUser, verifyToken };
