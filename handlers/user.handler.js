import User from '../models/User.model.js';

const findUserByEmail = (email) => {
  return User.findOne({ email });
};

const createUser = ({ email, password, username }) => {
  return User.create({
    email,
    password,
    username,
  });
};

export const userHandler = { findUserByEmail, createUser };
