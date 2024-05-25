import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";
import Company from "../model/company.js";

// Initialize the AutoIncrement plugin
const AutoIncrement = AutoIncrementFactory(mongoose);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false }, // Add isVerified field
    verificationToken: { type: String }, // Add verificationToken field
    token: { type: String },
    userType: { type: String, enum: ['company', 'user'], required: true },
  },
  {
    timestamps: true,
  }
);

// Add the AutoIncrement plugin to the schema
userSchema.plugin(AutoIncrement, { inc_field: 'userId' });


userSchema.pre('remove', async function(next) {
  try {
    const Company = mongoose.model("Company");
    const companies = await Company.find({ userId: this.userId });
    if (companies.length > 0) {
      const err = new Error('Cannot delete user with associated companies');
      err.status = 400;
      return next(err);
    }
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
