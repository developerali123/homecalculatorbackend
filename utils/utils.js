import Company from "../model/company.js";
import Review from "../model/companyreview.js";

export const updateCompanyRating = async (companyId) => {
  try {
    const reviews = await Review.find({ companyId: companyId });
    if (reviews.length > 0) {
      // Calculate the average for each of the 7 ratings
      const averageRatings = reviews.reduce(
        (acc, curr) => {
          acc.rating1 += curr.ratings.rating1;
          acc.rating2 += curr.ratings.rating2;
          acc.rating3 += curr.ratings.rating3;
          acc.rating4 += curr.ratings.rating4;
          acc.rating5 += curr.ratings.rating5;
          acc.rating6 += curr.ratings.rating6;
          acc.rating7 += curr.ratings.rating7;
          return acc;
        },
        {
          rating1: 0,
          rating2: 0,
          rating3: 0,
          rating4: 0,
          rating5: 0,
          rating6: 0,
          rating7: 0,
        }
      );

      // Divide each total by the number of reviews to get the average
      Object.keys(averageRatings).forEach((key) => {
        averageRatings[key] /= reviews.length;
      });

      // Calculate the overall average from the individual averages
      const overallAverage =
        (averageRatings.rating1 +
          averageRatings.rating2 +
          averageRatings.rating3 +
          averageRatings.rating4 +
          averageRatings.rating5 +
          averageRatings.rating6 +
          averageRatings.rating7) /
        7;

      // Update the company document with new ratings
      await Company.updateOne(
        { companyId: companyId },
        {
          rating: overallAverage,
          Professionalism: averageRatings.rating3,
          Punctuality: averageRatings.rating4,
          Price: averageRatings.rating5,
          Treatment: averageRatings.rating6,
          Servicequality: averageRatings.rating7,
          satisfaction: (averageRatings.rating1 + averageRatings.rating2) / 2
        }
      );
    }
  } catch (error) {
    console.error("Failed to update company rating:", error);
  }
};
