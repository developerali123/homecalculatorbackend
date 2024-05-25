import express from "express";
import { getactivetenders, getpendingtenders, sendtenders, tenderdetails } from "../controllers/tendercontroller.js";

const router = express.Router();

// POST /api/companies - Create a new company
router.post("/sendtender",sendtenders);
router.post("/tenderdetails",tenderdetails);

router.get('/getactivetenders/:userId', getactivetenders);
router.get('/getpendingtenders/:userId', getpendingtenders);

export default router;
