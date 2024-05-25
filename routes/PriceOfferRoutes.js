import express from "express";
import {
    confirmpriceoffer,
  getPriceOffer,
  sendoffer,
  updatePriceOffer,
} from "../controllers/priceoffercontroller.js";

const router = express.Router();

router.post("/sendoffer", sendoffer);
router.get("/getoffers/:tenderId", getPriceOffer);
router.post("/updateoffer", updatePriceOffer);
router.post("/updateStatusAndConfirm", confirmpriceoffer);

export default router;
