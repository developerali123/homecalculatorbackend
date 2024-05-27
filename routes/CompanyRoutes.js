import express from "express";
import { addreview, companyregister } from "../controllers/companycontroller.js";

const router = express.Router();

// POST /api/companies - Create a new company
router.post("/add", companyregister);
router.post("/reviews", addreview);

export default router;
