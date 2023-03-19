const { Schema, model } = require("mongoose");

const familySchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Give a title of your group"],
      unique: true,
    },
    tags: [
      {
        type: String,
        unique: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Family = model("Family", familySchema);

module.exports = Family;
