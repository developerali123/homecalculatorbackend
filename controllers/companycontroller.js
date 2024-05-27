import Company from "../model/company.js";
import Review from "../model/companyreview.js";

export const companyregister = async (req, res) => {
  try {
    const { companyName, userId, numberOfTrucks, city, companyId,phoneNumber } = req.body;

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
      phoneNumber
    });

    // Save the company to the database
    await company.save();

    res.status(201).json({ message: "Company created successfully", company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create company" });
  }
};

async function updateCompanyRating(companyId) {
  try {
    const reviews = await Review.find({ companyId: companyId });
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
      const averageRating = totalRating / reviews.length;
      await Company.updateOne({ companyId: companyId }, { rating: averageRating });
    }
  } catch (error) {
    console.error('Failed to update company rating:', error);
  }
}


export const addreview=async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    await updateCompanyRating(req.body.companyId); // Update the company rating
    res.status(201).send(newReview);
  } catch (error) {
    res.status(400).send(error);
  }
}
