import express from "express";
import { familyController } from "../controllers/family.controller.js";
import { isAuthenticated } from "../middleware/jwt.middleware.js";

const familyRoutes = express.Router();

// POST /api/family  -  Create a new family
familyRoutes.post("/family", isAuthenticated, familyController.createNewFamily);

// GET /api/families  -  Get all families
familyRoutes.get("/families", isAuthenticated, familyController.getUserFamilies);

// GET /api/families/:familyId -  Get single family
familyRoutes.get("/families/:familyId", isAuthenticated, familyController.getFamilyById);

export default familyRoutes;
