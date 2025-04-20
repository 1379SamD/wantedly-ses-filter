import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  title: String,
  companyName: String,
  topImagePic: String,
  wantedlyUrl: String,
  sesFlag: Boolean,
});

export const Card = mongoose.model("Card", cardSchema);

