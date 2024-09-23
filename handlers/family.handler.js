import Family from '../models/Family.model.js';

const createFamily = ({ title, description, members }) => {
  return Family.create({
    title,
    description,
    members,
  });
};

const getUserFamilies = (userId) => {
  return Family.find({
    members: { $in: [userId] },
  }).populate('members');
};

const getFamilyById = (familyId) => {
  return Family.findById(familyId).populate('members');
};

export const familyHandler = {
  createFamily,
  getUserFamilies,
  getFamilyById,
};
