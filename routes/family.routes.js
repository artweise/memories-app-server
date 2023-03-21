const router = require("express").Router();
const Family = require("../models/Family.model");
const mongoose = require("mongoose");

// POST /api/families  -  Creates a new family
router.post("/families", (req, res, next) => {
  const { title, description } = req.body;

  Family.create({ title, description, tags: [] })
    .then((newFamily) => {
      res.json(newFamily);
    })
    .catch((error) => console.log(error));
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
