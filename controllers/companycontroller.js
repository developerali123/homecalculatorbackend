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
  const { fullName, companyName, numberOfTrucks, phoneNumber, city, companyId } = req.body;

  try {
    // Update the user
    const updatedUser = await User.findOneAndUpdate(
      { userId }, 
      { name: fullName }, // Assuming fullName maps to 'name' in User schema
      { new: true, session }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    // Update the associated company
    const updatedCompany = await Company.findOneAndUpdate(
      { userId: updatedUser.userId },
      { companyName, numberOfTrucks, phoneNumber, city },
      { new: true, session }
    );

    if (!updatedCompany) {
      throw new Error("Company not found");
    }

    // Send the updated data back to the client
    res.status(200).json({
      user: updatedUser,
      company: updatedCompany,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}