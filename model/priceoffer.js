import mongoose from "mongoose";

const priceOfferSchema = new mongoose.Schema(
  {
    companyId: { type: Number, ref: "Company", required: true },
    tenderId: { type: Number, ref: "Tender", required: true },
    orderconfirm: { type: Boolean, default: false, required: true },
    priceconfirm: { type: Boolean, default: false, required: true },
    priceOffer: { type: Number, required: true },
    transportdate: { type: Date, required: true },
    arrivaldate: { type: Date, required: true },
    starthours: { type: String, required: true },
    endhours: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const PriceOffer = mongoose.model("PriceOffer", priceOfferSchema);
export default PriceOffer;
