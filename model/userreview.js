import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true, ref: "User" },
    tender_cancel:{type:Array},
    auction_experience:{type:Array},
    tender_service:{type:Array},
    ratings: { // Store individual ratings for each question
      rating1: {type:Number,default:5},
    },
    comments: { // Store comments for each rating
      comment1: {type:String},
      comment2: {type:String},
    },
  },
  {
    timestamps: true
  }
);

const UserReview = mongoose.model("UserReview", reviewSchema);
export default UserReview;
