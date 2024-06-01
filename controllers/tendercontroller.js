import mongoose from "mongoose";
import Tender from "../model/tender.js";
import TenderDetails from "../model/tenderdetails.js";
import Company from "../model/company.js";
import PriceOffer from "../model/priceoffer.js";
import { confirmpriceoffer } from "./priceoffercontroller.js";

export const sendtenders = async (req, res) => {
  const {
    userId,
    name,
    phonenumber,
    movingPrice,
    additionalDetails,
    originaddress,
    destinationaddress,
    transportdate,
    arrivaldate,
    starthours,
    endhours,
  } = req.body;

  try {
    const newTender = new Tender({
      userId,
      name,
      phonenumber,
      additionalDetails,
      movingPrice,
      originaddress,
      destinationaddress,
      transportdate,
      arrivaldate,
      starthours,
      endhours,
    });

    const savedTender = await newTender.save();
    res.status(201).json(savedTender);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const tenderdetails = async (req, res) => {
  try {
    const newTenderDetails = new TenderDetails({
      tenderId: req.body.tenderId,
      originaddress: req.body.originaddress,
      distance: req.body.distance, // Pass string directly; let Mongoose handle the conversion
      distanceprice: req.body.distanceprice,
      destinationaddress: req.body.destinationaddress,
      originfloor: req.body.originfloor,
      itemsprice: req.body.itemsprice,
      originfloorprice: req.body.originfloorprice,
      destinationfloor: req.body.destinationfloor,
      destinationfloorprice: req.body.destinationfloorprice,
      origintruckAccess: req.body.origintruckAccess,
      origintruckaccessprice: req.body.origintruckaccessprice,
      destinationtruckAccess: req.body.destinationtruckAccess,
      destinationtruckaccessprice: req.body.destinationtruckaccessprice,
      items: req.body.items,
      assembledItems: req.body.assembledItems,
      disassembledItems: req.body.disassembledItems,
      boxes: req.body.boxes,
      boxesPrice: req.body.boxesPrice,
      originCranePrice: req.body.originCranePrice,
      destinationCranePrice: req.body.destinationCranePrice,
      packingprice: req.body.packingprice,
    });

    const savedTenderDetails = await newTenderDetails.save();
    res.status(201).json(savedTenderDetails);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getactivetenders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const company = await Company.findOne({ userId: userId });
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const companyId = company.companyId;

    // Fetch price offers associated with the company
    const companyPriceOffers = await PriceOffer.find({ 
      companyId: companyId,
    });

    

    // Find the lowest price offer for each tenderId associated with the company
    const lowestPriceOffers = companyPriceOffers.reduce((acc, offer) => {
      if (
        !acc[offer.tenderId] ||
        acc[offer.tenderId].priceOffer > offer.priceOffer
      ) {
        acc[offer.tenderId] = offer;
      }
      return acc;
    }, {});

    const tenderIds = Object.keys(lowestPriceOffers);

    // Find pending tenders associated with the tenderIds
    const tenders = await Tender.find({
      tenderStatus: "Active",
    });
    const tenderDetails = await TenderDetails.find();

    // Fetch all price offers to find the overall lowest offer for each tenderId
    const allPriceOffers = await PriceOffer.find({
    });

    const bestOffers = allPriceOffers.reduce((acc, offer) => {
      if (
        !acc[offer.tenderId] ||
        acc[offer.tenderId].priceOffer > offer.priceOffer
      ) {
        acc[offer.tenderId] = offer;
      }
      return acc;
    }, {});

    const result = tenders.map((tender) => {
      const details = tenderDetails.filter(
        (detail) => detail.tenderId === tender.tenderId
      );
      const priceOffer = lowestPriceOffers[tender.tenderId];
      const bestOffer = bestOffers[tender.tenderId];

      return {
        ...tender._doc,
        details: details,
        priceOffer: priceOffer ? priceOffer.priceOffer : null, // Include the lowest price offer for the company if available
        priceconfirm:companyPriceOffers[0]?.priceconfirm?companyPriceOffers[0]?.priceconfirm:false,
        bestOffer: bestOffer ? bestOffer.priceOffer : null, // Include the overall lowest price offer if available
      };
    });
    // 
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getpendingtenders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const company = await Company.findOne({ userId: userId });
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const companyId = company.companyId;

    // Fetch price offers associated with the company
    const companyPriceOffers = await PriceOffer.find({ 
      companyId: companyId,
    });

    // Find the lowest price offer for each tenderId associated with the company
    const lowestPriceOffers = companyPriceOffers.reduce((acc, offer) => {
      if (
        !acc[offer.tenderId] ||
        acc[offer.tenderId].priceOffer > offer.priceOffer
      ) {
        acc[offer.tenderId] = offer;
      }
      return acc;
    }, {});

    const tenderIds = Object.keys(lowestPriceOffers);

    // Find pending and active tenders associated with the tenderIds
    const tenders = await Tender.find({
      tenderStatus: { $in: ["Active", "Cancel"] },
    });

    const tenderDetails = await TenderDetails.find();

    // Fetch all price offers to find the overall lowest offer for each tenderId
    const allPriceOffers = await PriceOffer.find();

    const bestOffers = allPriceOffers.reduce((acc, offer) => {
      if (
        !acc[offer.tenderId] ||
        acc[offer.tenderId].priceOffer > offer.priceOffer
      ) {
        acc[offer.tenderId] = offer;
      }
      return acc;
    }, {});

    const result = tenders.map((tender) => {
      const details = tenderDetails.filter(
        (detail) => detail.tenderId === tender.tenderId
      );
      const priceOffer = lowestPriceOffers[tender.tenderId];
      const bestOffer = bestOffers[tender.tenderId];

      return {
        ...tender._doc,
        details: details,
        priceOffer: priceOffer ? priceOffer.priceOffer : null, // Include the lowest price offer for the company if available
        priceconfirm: companyPriceOffers[0]?.priceconfirm,
        bestOffer: bestOffer ? bestOffer.priceOffer : null, // Include the overall lowest price offer if available
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getapprovedtenders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const company = await Company.findOne({ userId: userId });
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const companyId = company.companyId;

    // Fetch price offers associated with the company
    const companyPriceOffers = await PriceOffer.find({ 
      companyId: companyId,
    });

    // Find the lowest price offer for each tenderId associated with the company
    const lowestPriceOffers = companyPriceOffers.reduce((acc, offer) => {
      if (
        !acc[offer.tenderId] ||
        acc[offer.tenderId].priceOffer > offer.priceOffer
      ) {
        acc[offer.tenderId] = offer;
      }
      return acc;
    }, {});

    const tenderIds = Object.keys(lowestPriceOffers);

    // Find pending and active tenders associated with the tenderIds
    const tenders = await Tender.find({
      tenderStatus: { $in: ["Confirmed", "Finished"] },
    });

    const tenderDetails = await TenderDetails.find();

    // Fetch all price offers to find the overall lowest offer for each tenderId
    const allPriceOffers = await PriceOffer.find();

    const bestOffers = allPriceOffers.reduce((acc, offer) => {
      if (
        !acc[offer.tenderId] ||
        acc[offer.tenderId].priceOffer > offer.priceOffer
      ) {
        acc[offer.tenderId] = offer;
      }
      return acc;
    }, {});

    const result = tenders.map((tender) => {
      const details = tenderDetails.filter(
        (detail) => detail.tenderId === tender.tenderId
      );
      const priceOffer = lowestPriceOffers[tender.tenderId];
      const bestOffer = bestOffers[tender.tenderId];

      return {
        ...tender._doc,
        details: details,
        priceOffer: priceOffer ? priceOffer.priceOffer : null, // Include the lowest price offer for the company if available
        priceconfirm: companyPriceOffers[0]?.priceconfirm,
        bestOffer: bestOffer ? bestOffer.priceOffer : null, // Include the overall lowest price offer if available
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


export const canceltender=async (req, res) => {
  const { tenderId } = req.params;
  try {
    const updatedTender = await Tender.findOneAndUpdate(
      { tenderId },
      { tenderStatus: "Cancel" },
      { new: true }
    );
    if (!updatedTender) {
      return res.status(404).json({ message: "Tender not found" });
    }
    res.json(updatedTender);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating tender status", error: err });
  }
}

export const finishtender=async (req, res) => {
  const { tenderId } = req.params;
  try {
    const updatedTender = await Tender.findOneAndUpdate(
      { tenderId },
      { tenderStatus: "Finished" },
      { new: true }
    );
    if (!updatedTender) {
      return res.status(404).json({ message: "Tender not found" });
    }
    res.json(updatedTender);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating tender status", error: err });
  }
}