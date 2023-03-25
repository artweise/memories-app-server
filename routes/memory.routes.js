const router = require("express").Router();
const Family = require("../models/Family.model");
const Memory = require("../models/Memory.model");
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");

//  POST /api/memories  -  Creates a new memory in the family collection
router.post(
  "/families/:familyId/memories",
  isAuthenticated,
  async (req, res, next) => {
    const { publication, date, place, tags, familyId } = req.body;

    // Check if the memories array exists
    if (!memories) {
      memories = [];
    }

    let createdMemory;
    // Create a new family with the information from req.body
    Memory.create({ publication, date, place, tags, family: familyId })
      .then((newMemory) => {
        return Family.findByIdAndUpdate(familyId, {
          $push: { memories: newMemory._id },
        });
      })
      .then((updatedFamily) => {
        createdMemory =
          updatedFamily.memories[updatedFamily.memories.length - 1];
        res.status(201).json(createdMemory);
      })
      // Return an error message if something goes wrong
      .catch((error) => {
        console.log(error);
        res.status(500).json({ message: error.message });
      });
  }
);

module.exports = router;
