import { ObjectId } from "mongodb";

import { memoryHandler } from "../handlers/memory.handler.js";

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

const uploadFiles = async (req, res, next) => {
  if (!req.files) {
    res.status(400).json({ message: "No files attached" });
  }
  const fileUrls = req.files.map((file) => file.path);
  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrls' can be any name, just make sure you remember to use the same when accessing it on the frontend
  res.json({ fileUrls });
};

const createNewMemory = async (req, res, next) => {
  const userId = req.payload._id;
  const { title, publication, date, place, isPrivate, tags, familyId, gallery } = req.body;

  const familyObjectId = new ObjectId(familyId);
  const memoryToCreate = {
    title,
    publication,
    date: new Date(date),
    place,
    tags,
    family: familyObjectId,
    createdBy: userId,
    gallery,
  };
  if (isPrivate) {
    memoryToCreate.owner = userId;
  }
  try {
    const createdMemory = await memoryHandler.createMemory(memoryToCreate);
    res.status(200).json(createdMemory);
  } catch (error) {
    // In this case, we send error handling to the error handling middleware.
    next(error);
  }
};

const getMemoriesByFamilyId = async (req, res, next) => {
  const { familyId } = req.params;
  try {
    const memories = await memoryHandler.getMemoriesByFamilyId(familyId);
    res.status(200).json(memories);
  } catch (error) {
    // In this case, we send error handling to the error handling middleware.
    next(error);
  }
};

const getMemoryById = async (req, res, next) => {
  const { memoryId } = req.params;
  try {
    const memory = await memoryHandler.getMemoryById(memoryId);
    res.status(200).json(memory);
  } catch (error) {
    // In this case, we send error handling to the error handling middleware.
    next(error);
  }
};

const editMemory = async (req, res, next) => {
  const userId = req.payload._id;
  const { memoryId } = req.params;

  const { title, publication, date, place, isPrivate, tags, familyId, gallery } = req.body;

  const familyObjectId = new ObjectId(familyId);

  const memoryData = {
    title,
    publication,
    date: new Date(date),
    place,
    tags,
    family: familyObjectId,
    updatedBy: userId,
    gallery,
    // When using findByIdAndUpdate in Mongoose, you can delete a key based on a condition by using the $unset operator in your update object.
    $unset: {},
  };
  if (isPrivate) {
    memoryData.owner = userId;
  } else {
    // If isPrivate is false, delete the 'owner' field from the document
    memoryData.$unset.owner = "";
  }
  try {
    const updatedMemory = await memoryHandler.editMemoryById(memoryId, memoryData);
    res.status(200).json(updatedMemory);
  } catch (error) {
    // In this case, we send error handling to the error handling middleware.
    next(error);
  }
};

const deleteMemory = async (req, res, next) => {
  const { memoryId } = req.params;
  try {
    await memoryHandler.deleteMemoryById(memoryId);
    res.status(200).json({ message: "Memory was deleted successfully" });
  } catch (error) {
    console.log("Error while deleting a memory");
    // In this case, we send error handling to the error handling middleware.
    next(error);
  }
};

export const memoryController = {
  uploadFiles,
  createNewMemory,
  getMemoriesByFamilyId,
  getMemoryById,
  editMemory,
  deleteMemory,
};
