const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
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
