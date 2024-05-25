import express from "express";
import { login, register, updatePassword, verify, verifycode, verifyemail } from "../controllers/usercontroller.js";

const router = express.Router();

router.post("/register", register);

router.post("/verify", verify);

router.post("/login", login);

router.post("/verifyemail", verifyemail);

router.post("/verifycode", verifycode);

router.put("/updatepassword", updatePassword);

export default router;
