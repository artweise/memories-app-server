import { Schema, model } from "mongoose";

const collectionSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Give a title of your collection"],
      unique: true,
    },
    family: {
      type: Schema.Types.ObjectId,
      ref: "Family",
      required: true,
    },
    memories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Memory",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Collection = model("Collection", collectionSchema);

export default Collection;
