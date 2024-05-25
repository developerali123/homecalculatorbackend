import express from "express";
import { companyregister } from "../controllers/companycontroller.js";

const router = express.Router();

// POST /api/companies - Create a new company
router.post("/add",companyregister);

export default router;
