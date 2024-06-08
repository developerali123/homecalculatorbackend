import Company from "../model/company.js";
import Review from "../model/companyreview.js";
import User from "../model/user.js";
import { updateCompanyRating } from "../utils/utils.js";

export const companyregister = async (req, res) => {
  try {
    const {
      companyName,
      userId,
      numberOfTrucks,
      city,
      companyId,
      phoneNumber,
    } = req.body;

    // Check if the company already exists
    const existingCompany = await Company.findOne({ companyId });
    if (existingCompany) {
      return res.status(400).json({ message: "Company already exists" });
    }

    // Create a new company
    const company = new Company({
      companyName,
      userId,
      numberOfTrucks,
      city,
      companyId,
      phoneNumber,
    });

    // Save the company to the database
    await company.save();

    res.status(201).json({ message: "Company created successfully", company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create company" });
  }
};

export const addreview = async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    await updateCompanyRating(req.body.companyId); // Update the company rating
    res.status(201).send(newReview);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updateprofile = async (req, res) => {
  const { userId } = req.params;
  const { userData, companyData } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Update User information if userData is provided
    if (userData) {
      await User.findByIdAndUpdate(userId, { $set: userData }, { new: true });
    }

    // Update Company information if companyData is provided
    if (companyData) {
      await Company.findOneAndUpdate(
        { userId: userId },
        { $set: companyData },
        { new: true }
      );
    }

    return res
      .status(200)
      .json({ message: "User and company profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error);
    return res
      .status(500)
      .json({ message: "Failed to update profile", error: error.message });
  }
};
