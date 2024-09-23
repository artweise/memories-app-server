import Memory from '../models/Memory.model.js';

const createMemory = (memory) => {
  return Memory.create(memory);
};

const getMemoriesByFamilyId = (familyId) => {
  return Memory.find({ family: familyId })
    .populate('family')
    .populate({
      path: 'createdBy',
      select: '-password',
    })
    .sort({ date: -1 });
};

const getMemoryById = (memoryId) => {
  return Memory.findById(memoryId).populate({
    path: 'createdBy',
    select: '-password',
  });
};

const editMemoryById = (memoryId, updatedMemory) => {
  return Memory.findByIdAndUpdate(memoryId, updatedMemory, {
    new: true,
  }).populate({
    path: 'createdBy',
    select: '-password',
  });
};

const deleteMemoryById = (memoryId) => {
  return Memory.findByIdAndDelete(memoryId);
};

export const memoryHandler = {
  createMemory,
  getMemoriesByFamilyId,
  getMemoryById,
  editMemoryById,
  deleteMemoryById,
};
