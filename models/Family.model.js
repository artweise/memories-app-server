const { Schema, model } = require("mongoose");

const familySchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Give a title of your group"],
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: "images/default-avatar.png",
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // tags should be unique, but the validation should be in the create moment
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Family = model("Family", familySchema);

module.exports = Family;
