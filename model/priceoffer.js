import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

// Initialize the AutoIncrement plugin
const AutoIncrement = AutoIncrementFactory(mongoose);

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

// Add the AutoIncrement plugin to the schema
priceOfferSchema.plugin(AutoIncrement, { inc_field: 'PriceId' });

const PriceOffer = mongoose.model("PriceOffer", priceOfferSchema);
export default PriceOffer;
