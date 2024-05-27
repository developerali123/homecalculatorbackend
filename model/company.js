import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    userId: { type: Number, required: true, ref: "User" },
    numberOfTrucks: { type: String, required: true },
    city: { type: String, required: true },
    companyId: { type: Number, required: true,unique: true},
    rating: { type: Number, default: 5 },
    phoneNumber: { type: String, required: true } 
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model("Company", companySchema);
export default Company;
