const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    avatar: {
      type: String,
      default: "images/default-avatar.png",
    },
    // families: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Family",
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
