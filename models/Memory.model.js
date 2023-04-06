const { Schema, model } = require("mongoose");

const memorySchema = new Schema(
  {
    title: {
      type: String,
      trim: false,
    },
    publication: {
      type: String,
      trim: false,
    },
    date: {
      type: Date,
    },
    place: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    family: {
      type: Schema.Types.ObjectId,
      ref: "Family",
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Memory = model("Memory", memorySchema);

module.exports = Memory;
