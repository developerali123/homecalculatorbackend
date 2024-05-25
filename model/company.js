import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    userId: { type: Number, required: true, ref: "User" },
    numberOfTrucks: { type: String, required: true },
    city: { type: String, required: true },
    companyId: { type: Number, required: true,unique: true},
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model("Company", companySchema);
export default Company;
