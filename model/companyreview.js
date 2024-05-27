import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true, ref: "User" },
    companyId: { type: Number, required: true, ref: "Company" },
    ratings: { // Store individual ratings for each question
      rating1: {type:Number,default:5},
      rating2: {type:Number,default:5},
      rating3: {type:Number,default:5},
      rating4: {type:Number,default:5},
      rating5: {type:Number,default:5},
      rating6: {type:Number,default:5},
      rating7: {type:Number,default:5},
    },
    comments: { // Store comments for each rating
      comment1: {type:String},
      comment2: {type:String},
      comment3: {type:String},
      comment4: {type:String},
      comment5: {type:String},
      comment6: {type:String},
      comment7: {type:String},
    },
    additionalDetails: {type:String} // Additional comments
  },
  {
    timestamps: true
  }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
