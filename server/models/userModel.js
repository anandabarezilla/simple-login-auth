import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    address: { type: String },
    profile: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
