import Company from "../model/company.js";
import PriceOffer from "../model/priceoffer.js";
import Tender from "../model/tender.js"; // Import the Tender model

export const sendoffer = async (req, res) => {
  const {
    userId,
    tenderId,
    priceOffer,
    transportdate,
    arrivaldate,
    starthours,
    endhours,
  } = req.body;

  try {
    // Find the companyId from the userId
    const company = await Company.findOne({ userId });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    const companyId = company.companyId;

    // Create a new PriceOffer
    const newPriceOffer = new PriceOffer({
      companyId,
      tenderId,
      priceOffer,
      transportdate,
      arrivaldate,
      starthours,
      endhours,
      priceconfirm: true,
    });

    // Save the PriceOffer to the database
    const savedPriceOffer = await newPriceOffer.save();
    res.status(201).json({ savedPriceOffer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPriceOffer = async (req, res) => {
  try {
    const tenderId = req.params.tenderId;

    // Find the Tender with the specified tenderId
    const tender = await Tender.findOne({ tenderId }).maxTimeMS(20000);
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }

    // Find the related PriceOffers for the specified tenderId
    const priceOffers = await PriceOffer.find({ tenderId });

    // Asynchronously retrieve company data for each price offer
    const priceOffersWithCompanyData = await Promise.all(priceOffers.map(async (offer) => {
      const companyDetails = await Company.findOne({ companyId: offer.companyId });
      return {
        moverId: offer.PriceId,
        tenderStatus: tender.tenderStatus,
        priceOffer: offer.priceOffer,
        orderconfirm: offer.orderconfirm,
        transportDate: offer.transportdate,
        arrivalDate: offer.arrivaldate,
        startHours: offer.starthours,
        endHours: offer.endhours,
        companyDetails: companyDetails // Embed the entire company document
      };
    }));

    res.json(priceOffersWithCompanyData);
  } catch (err) {
    console.error('Error fetching data', err);
    res.status(500).json({ message: 'Server error' });
  }
}


export const updatePriceOffer = async (req, res) => {
  const {
    userId,
    tenderId,
    priceOffer,
    transportdate,
    arrivaldate,
    starthours,
    endhours,
  } = req.body;

  try {
    // Find the companyId from the userId
    const company = await Company.findOne({ userId });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    const companyId = company.companyId;

    // Find the PriceOffer with the specified companyId and tenderId
    const priceOfferDoc = await PriceOffer.findOne({ companyId, tenderId });
    if (!priceOfferDoc) {
      return res.status(404).json({ message: 'Price offer not found' });
    }

    // Update the fields
    priceOfferDoc.priceOffer = priceOffer;
    priceOfferDoc.transportdate = transportdate;
    priceOfferDoc.arrivaldate = arrivaldate;
    priceOfferDoc.starthours = starthours;
    priceOfferDoc.endhours = endhours;

    // Save the updated PriceOffer to the database
    const updatedPriceOffer = await priceOfferDoc.save();
    res.status(200).json({ updatedPriceOffer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const confirmpriceoffer=async (req, res) => {
  const { tenderId, companyId } = req.body;

  try {
    // Update Tender status to 'Pending'
    const updatedTender = await Tender.findOneAndUpdate(
      { tenderId },
      { tenderStatus: "Confirmed" },
      { new: true }
    );

    // Update PriceOffer to set orderconfirm to true
    const updatedPriceOffer = await PriceOffer.findOneAndUpdate(
      { tenderId, companyId },
      { orderconfirm: true },
      { new: true }
    );

    // Check if both updates are successful
    if (!updatedTender || !updatedPriceOffer) {
      return res
        .status(404)
        .json({ message: "Tender or Price Offer not found" });
    }

    // Return the updated documents
    res.json({
      updatedTender,
      updatedPriceOffer,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
}