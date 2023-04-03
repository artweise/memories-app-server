const router = require("express").Router();
const Family = require("../models/Family.model");
const User = require("../models/User.model");
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// POST /api/family  -  Create a new family
router.post("/family", isAuthenticated, async (req, res, next) => {
  let { title, description, members } = req.body;

  const { email } = req.payload;

  // Check if the required fields are provided
  if (!title) {
    return res.status(400).json({
      message: "Please provide the title of the family.",
    });
  }

  // Check if the members array exists
  if (!members) {
    members = [];
  }

  // Add the current user email to the members array
  members.push(email);

  try {
    // Find all the user IDs for the members in the members array
    const memberIds = await Promise.all(
      members?.map(async (email) => {
        const foundedUser = await User.findOne({ email });
        // Check the users collection if a user with the member's email already exists
        if (!foundedUser) {
          res
            .status(400)
            .json({ message: `User with email ${email} not found` });
        }
        return foundedUser._id;
      })
    );
    // console.log(memberIds);

    // Create a new family with the information from req.body
    const newFamily = await Family.create({
      title,
      description,
      members: memberIds,
    });
    res.status(201).json(newFamily);
  } catch (error) {
    console.log(error);
    //   Check if the title is already in use by this user
    // if (error.code === 11000 && error.keyPattern.title === 1) {
    //   return res.status(400).json({
    //     message: `${title} is already in use. Please provide another title`,
    //   });
    // } else {
    //   next(error);
    // }
  }
});

// GET /api/families  -  Get all families
router.get("/families", isAuthenticated, async (req, res) => {
  const userId = req.payload._id;

  try {
    const allFamilies = await Family.find({
      members: { $in: [userId] },
    }).populate("members");

    res.json(allFamilies);
  } catch (error) {
    (error) => console.log(error);
  }
});

// GET /api/families/:familyId -  Get single family
router.get("/families/:familyId", isAuthenticated, async (req, res) => {
  try {
    const singleFamily = await Family.findById(req.params.familyId);
    res.json(singleFamily);
  } catch (error) {
    (error) => console.log(error);
  }
});

module.exports = router;
