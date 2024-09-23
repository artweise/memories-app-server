import { familyHandler } from '../handlers/family.handler.js';
import { userHandler } from '../handlers/user.handler.js';

const createNewFamily = async (req, res, next) => {
  let { title, description, members } = req.body;
  const { email } = req.payload;

  // Check if the required fields are provided
  if (!title) {
    return res.status(400).json({
      message: 'Please provide the title of the family.',
    });
  }
  // Check if the members array exists and remove duplicates if there are any
  if (members) {
    members = Array.from([...new Set(members)]);
  } else {
    members = [];
  }

  // Add the current user email to the members array if it was not added by the user
  if (!members.includes(email)) {
    members.push(email);
  }
  try {
    // Find all the user IDs for the members in the members array
    const memberIds = await Promise.all(
      members?.map(async (email) => {
        const foundedUser = await userHandler.findUserByEmail(email);
        // Check the users collection if a user with the member's email already exists
        if (!foundedUser) {
          res.status(400).json({ message: `User with email ${email} not found` });
        }
        return foundedUser._id;
      })
    );

    // Create a new family with the information from req.body
    const newFamily = await familyHandler.createFamily({
      title,
      description,
      members: memberIds,
    });
    res.status(201).json(newFamily);
  } catch (error) {
    // In this case, we send error handling to the error handling middleware.
    next(error);
  }
};

const getUserFamilies = async (req, res, next) => {
  const userId = req.payload._id;
  try {
    const allFamilies = await familyHandler.getUserFamilies(userId);
    res.json(allFamilies);
  } catch (error) {
    // In this case, we send error handling to the error handling middleware.
    next(error);
  }
};

const getFamilyById = async (req, res, next) => {
  const { familyId } = req.params;
  try {
    const family = await familyHandler.getFamilyById(familyId);
    res.json(family);
  } catch (error) {
    // In this case, we send error handling to the error handling middleware.
    next(error);
  }
};

export const familyController = {
  createNewFamily,
  getUserFamilies,
  getFamilyById,
};
