import express from 'express';

import fileUploader from '../config/cloudinary.config.js';
import { isAuthenticated } from '../middleware/jwt.middleware.js';
import { memoryController } from '../controllers/memory.controller.js';

const memoryRoutes = express.Router();

// POST /api/upload => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
// router.post("/upload", fileUploader.single("gallery"), (req, res, next) => {
//   if (!req.file) {
//     next(new Error("No file uploaded!"));
//     return;
//   }
//   // Get the URL of the uploaded file and send it as a response.
//   // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend

//   res.json({ fileUrl: req.file.path });
// });

// POST /api/upload => Route that receives IMAGES, sends it to Cloudinary via the fileUploader and returns the image URL
memoryRoutes.post('/upload', fileUploader.array('gallery', 10), memoryController.uploadFiles);

//  POST /api/memory  -  Creates a new memory in the family collection
memoryRoutes.post('/memory', isAuthenticated, memoryController.createNewMemory);

// GET /api/memories  -  Get all memories in the family collection
memoryRoutes.get('/memories/:familyId', isAuthenticated, memoryController.getMemoriesByFamilyId);

// GET /api/memory/:memoryId  -  Get one memory in the family collection
memoryRoutes.get('/memory/:memoryId', isAuthenticated, memoryController.getMemoryById);

// PUT /api/memory/:memoryId  -  Edit memory details
memoryRoutes.put('/memory/:memoryId', isAuthenticated, memoryController.editMemory);

// DELETE /api/memory/:memoryId  -  Delete memory
memoryRoutes.delete('/memory/:memoryId', isAuthenticated, memoryController.deleteMemory);

export default memoryRoutes;
