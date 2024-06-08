import express from "express";
import {
  addreview,
  companyregister,
  updateprofile,
} from "../controllers/companycontroller.js";

const router = express.Router();

// POST /api/companies - Create a new company
router.post("/add", companyregister);
router.post("/reviews", addreview);
router.put("/updateProfile/:userId", updateprofile);

export default router;
