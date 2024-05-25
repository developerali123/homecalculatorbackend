import mongoose from "mongoose";

const tenderSchema = new mongoose.Schema({
  tenderId: { type: Number, required: true, ref: "Tender" },
  originaddress: { type: String, required: true },
  distance: { type: mongoose.Schema.Types.Decimal128, required: true },
  distanceprice: { type: mongoose.Schema.Types.Decimal128, required: true },
  destinationaddress: { type: String, required: true },
  originfloor: { type: Number, required: true },
  itemsprice: { type: mongoose.Schema.Types.Decimal128, required: true },
  originfloorprice: { type: mongoose.Schema.Types.Decimal128, required: true },
  destinationfloor: { type: Number, required: true },
  destinationfloorprice: { type: mongoose.Schema.Types.Decimal128, required: true },
  origintruckAccess: { type: String, required: true },
  origintruckaccessprice: { type: mongoose.Schema.Types.Decimal128, required: true },
  destinationtruckAccess: { type: String, required: true },
  destinationtruckaccessprice: { type: mongoose.Schema.Types.Decimal128, required: true },
  items: { type: Array, required: true },
  assembledItems: { type: Array, required: true },
  disassembledItems: { type: Array, required: true },
  boxes: { type: Number, required: true },
  boxesPrice: { type: mongoose.Schema.Types.Decimal128, required: true },
  originCranePrice: { type: mongoose.Schema.Types.Decimal128, required: true },
  destinationCranePrice: { type: mongoose.Schema.Types.Decimal128, required: true },
  packingprice: { type: mongoose.Schema.Types.Decimal128, required: true },
},{
  timestamps: true,
});

const TenderDetails = mongoose.model("Tenderdetails", tenderSchema);

export default TenderDetails;
