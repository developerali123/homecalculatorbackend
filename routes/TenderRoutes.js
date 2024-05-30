import express from "express";
import {
    canceltender,
  finishtender,
  getactivetenders,
  getpendingtenders,
  sendtenders,
  tenderdetails,
} from "../controllers/tendercontroller.js";

const router = express.Router();

// POST /api/companies - Create a new company
router.post("/sendtender", sendtenders);
router.post("/tenderdetails", tenderdetails);

router.get("/getactivetenders/:userId", getactivetenders);
router.get("/getpendingtenders/:userId", getpendingtenders);
router.post("/cancelTender/:tenderId", canceltender);
router.post("/finishTender/:tenderId", finishtender);

export default router;
