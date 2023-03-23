const router = require("express").Router();
const Family = require("../models/Family.model");
const User = require("../models/User.model");
const mongoose = require("mongoose");

router.post("/families", async (req, res, next) => {
  const { title, description, userId, members } = req.body;

  try {
    // Find all the user IDs for the members in the members array
    const memberIds = await Promise.all(
      members.map(async (email) => {
        const foundedUser = await User.findOne({ email });
        // Check the users collection if a user with the member's email already exists
        if (!foundedUser) {
          res
            .status(400)
            .json({ message: `User with email ${email} not found` });
          //   throw new Error(`User with email ${email} not found`);
        }
        return foundedUser._id;
      })
    );
    // Add the current user's ID to the memberIds array
    memberIds.push(userId);
    // Create a new family with the information from req.body
    const newFamily = await Family.create({
      title,
      description,
      members: memberIds,
    });
    res.status(201).json(newFamily);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/families  -  Get all families (groups of people)
router.get("/families", (req, res, next) => {
  Family.find()
    .then((allFamilies) => {
      res.json(allFamilies);
    })
    .catch((error) => console.log(error));
});

// GET /api/families/:familyId -  Get single family
router.get("/families/:familyId", (req, res, next) => {
  Family.findById(req.params.familyId)
    .then((singleFamily) => {
      res.json(singleFamily);
    })
    .catch((error) => console.log(error));
});

module.exports = router;
