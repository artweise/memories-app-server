const router = require("express").Router();
const Family = require("../models/Family.model");
const User = require("../models/User.model");
const mongoose = require("mongoose");

// POST /api/families  -  Creates a new family
// and add the ID from this created family to the array of families of the user
router.post("/families", (req, res, next) => {
  const { title, description, userId } = req.body;
  let createdFamily;
  // Create a new family with the information from req.body
  Family.create({ title, description })

    // VALIDATION UNIQUE TITLE OF THE FAMILY!!!

    .then((newFamily) => {
      // Save created family to the db
      createdFamily = newFamily;
      //   console.log("Created family -> ", createdFamily);
      //   console.log("User ID -> ", userId);
      return User.findById(userId);
    })
    .then((foundedUser) => {
      // Find the user in db using the userId
      //   User.findById(userId);
      // Add the createdFamilyId to the user's families array
      foundedUser.families.push(createdFamily._id);
      // Save the updated user object to the database
      foundedUser.save();
      // Return a new family object
      //   ADD A SUCCESS MESSAGE ON THE FRONTEND!!!
      res.status(201).json(createdFamily);
    })
    // Return an error message if something goes wrong
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: error.message });
    });
});

// router.post("/families", async (req, res, next) => {
//   try {
//     const { title, description, userId } = req.body;
//     // Create a new family
//     const newFamily = new Family({ title, description });
//     // Save created family to the db
//     const savedFamily = await newFamily.save();
//     // Find the user in the database using the userId
//     const foundedUser = await User.findById(userId);
//     // Add the savedFamilyId to the user's families array
//     foundedUser.families.push(savedFamily._id);
//     // Save the updated user object to the database
//     await foundedUser.save();
//     // Return a success message /and the new family object
//     res.status(201).json(savedFamily);
//   } catch (error) {
//     // Return an error message if something goes wrong
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// });

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
