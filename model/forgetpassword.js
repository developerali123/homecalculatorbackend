import mongoose from "mongoose";

const ForgetPasswordSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    isVerified: { type: Boolean, default: false }, // Add isVerified field
    verificationToken: { type: String }, // Add verificationToken field
    token: { type: String },
  },
  {
    timestamps: true,
  }
);

const ForgetPassword = mongoose.model("ForgetPassword", ForgetPasswordSchema);
export default ForgetPassword;
