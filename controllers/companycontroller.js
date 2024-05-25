import Company from "../model/company.js";

export const companyregister = async (req, res) => {
  try {
    const { companyName, userId, numberOfTrucks, city, companyId } = req.body;

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
    });

    // Save the company to the database
    await company.save();

    res.status(201).json({ message: "Company created successfully", company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create company" });
  }
};
