import express from "express";
import { authController } from "../controllers/auth.controller.js";

// Import necessary (isAuthenticated) middleware in order to control access to specific routes
import { isAuthenticated } from "../middleware/jwt.middleware.js";

const authRoutes = express.Router();

// POST /auth/signup  - Creates a new user in the database
authRoutes.post("/signup", authController.createUser);

// POST  /auth/login - Verifies email and password and returns a JWT
authRoutes.post("/login", authController.loginUser);

// GET  /auth/verify  -  Used to verify JWT stored on the client
authRoutes.get("/verify", isAuthenticated, authController.verifyToken);

export default authRoutes;
