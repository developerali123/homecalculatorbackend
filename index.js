import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import axios from "axios";
import morgan from "morgan";
import connectDB from "./config/database.js";
import auth from "./middleware/auth.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import CompanyRoutes from "./routes/CompanyRoutes.js";
import TenderRoutes from "./routes/TenderRoutes.js";
import PriceOfferRoutes from "./routes/PriceOfferRoutes.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerui from "swagger-ui-express";

//configure env
dotenv.config();

//database config
connectDB();

//rest objects
const app = express();

//cors
app.use(cors())
app.use(express.json({ limit: "50mb" }));

//middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

//routes
// app.use('/api', routes)

//rest apis
app.get("/", (req, res) => {
  res.send({
    message: "Welcome to Ecommerce Website",
  });
});

app.get('/distance', async (req, res) => {
  const { origins, destinations } = req.query;
  const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=AIzaSyAuIchE5mdfEw_S7oM8I5ZkpCcQyWOMg-Y`;
  
  try {
    const response = await axios.get(apiUrl);
    const distanceValue = response.data.rows[0].elements[0].distance.value;
    const distanceInKm = distanceValue / 1000;
    const price = 2 * distanceInKm;
    
    res.json({ distanceInKm, price });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.use('/api', AuthRoutes);
app.use('/api/company', CompanyRoutes);
app.use('/api/tenders', TenderRoutes);
app.use('/api/priceoffer', PriceOfferRoutes);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

//port
const PORT = process.env.PORT || 8080;

//swagger config
const options={
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tender Creation",
      version: "1.0.0",
      description: "Tender Backend",
      contact:{
        name: "Muhammad Ali Mirza",
        url: "http://localhost:4000/api-docs",
        email: "muhan.mirza@gmail.com",
      }
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["./routes/*.js"],
}
const spacs=swaggerJSDoc(options);
app.use("/api-docs",swaggerui.serve,swaggerui.setup(spacs)); 

//run listen
app.listen(PORT, () => {
  
});
