import { Schema, model } from "mongoose";

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
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    family: {
      type: Schema.Types.ObjectId,
      ref: "Family",
      required: true,
    },
    gallery: [
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

export default Memory;
