import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

// Initialize the AutoIncrement plugin
const AutoIncrement = AutoIncrementFactory(mongoose);

const tenderSchema = new mongoose.Schema({
  userId: { type: Number, ref: 'User', required: true },
  name: {type: String,required: true,},
  phonenumber: {type: String,required: true,},
  additionalDetails: {type: String,required: true,},
  tenderStatus: {type: String,enum: ['Pending', 'Cancel', 'Active', 'Confirmed', 'Finished'],default: 'Active',},
  movingPrice: {type: Number,required: true,},
  priceOffers: {type: String,enum: ['No offers', 'My offer', 'Best offer'],default: 'No offers',},
  originaddress: {type: String,required: true,},
  destinationaddress: {type: String,required: true,},
  transportdate: {type: Date,required: true,},
  arrivaldate: {type: Date,required: true,},
  starthours: {type: String,required: true,},
  endhours: {type: String,required: true,},
},{
  timestamps: true,
});

// Add the AutoIncrement plugin to the schema
tenderSchema.plugin(AutoIncrement, { inc_field: 'tenderId' });

const Tender = mongoose.model('Tender', tenderSchema);
export default Tender;
