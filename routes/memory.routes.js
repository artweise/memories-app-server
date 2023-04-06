const router = require("express").Router();
const Family = require("../models/Family.model");
const Memory = require("../models/Memory.model");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const fileUploader = require("../config/cloudinary.config");

const { isAuthenticated } = require("../middleware/jwt.middleware");

//  POST /api/memory  -  Creates a new memory in the family collection
router.post("/memory", isAuthenticated, async (req, res) => {
  const userId = req.payload._id;
  const { title, publication, date, place, isPrivate, tags, familyId } =
    req.body;

  const familyObjectId = new ObjectId(familyId);

  const memoryToCreate = {
    title,
    publication,
    date: new Date(date),
    place,
    tags,
    family: familyObjectId,
    createdBy: userId,
  };
  if (isPrivate) {
    memoryToCreate.owner = userId;
  }

  Memory.create(memoryToCreate)
    .then((newMemory) => {
      res.status(200).json(newMemory);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: error.message });
    });
});

// POST /api/upload => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/upload", fileUploader.single("images"), (req, res, next) => {
  // console.log("file is: ", req.file)

  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }

  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend

  res.json({ fileUrl: req.file.path });
});

// POST /api/memories  -  Get all memories in the family collection
router.post("/memories", isAuthenticated, async (req, res) => {
  const { familyId } = req.body;

  // Find all memories in the family collection
  try {
    const memories = await Memory.find({ family: familyId }).populate("family");
    res.status(200).json(memories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/memory/:memoryId  -  Get one memory in the family collection
router.get("/memory/:memoryId", isAuthenticated, async (req, res) => {
  const { memoryId } = req.params;

  try {
    const memory = await Memory.findById(memoryId);
    res.status(200).json(memory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/memory/:memoryId  -  Edit memory details
router.put("/memory/:memoryId", isAuthenticated, async (req, res) => {
  const { memoryId } = req.params;
  // const { data } = req.body;
  const { title, publication, date, place, tags, familyId, userId } = req.body;

  // if (!data) {
  //   res.status(400).json({ message: "Missing data in request body" });
  //   return;
  // }
  // const { publication, date, place, tags, family: familyId, userId } = data;

  try {
    const updatedMemory = await Memory.findByIdAndUpdate(
      memoryId,
      { title, publication, date, place, tags, family: familyId, userId },
      // data,
      {
        new: true,
      }
    );
    res.status(200).json(updatedMemory);
  } catch (error) {
    console.log("Error occured while editing your memory: " + error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/memory/:memoryId  -  Delete memory
router.delete("/memory/:memoryId", isAuthenticated, async (req, res) => {
  const { memoryId } = req.params;

  try {
    await Memory.findByIdAndDelete(memoryId);
    res.status(200).json({ message: "Memory was succsessfully deleted" });
  } catch (error) {
    console.log("Error while deleting a memory: " + error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
