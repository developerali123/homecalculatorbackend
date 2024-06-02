import express from "express";
import {
  login,
  register,
  updatePassword,
  userbyid,
  userreview,
  verify,
  verifycode,
  verifyemail,
} from "../controllers/usercontroller.js";

const router = express.Router();

router.post("/register", register);

router.post("/verify", verify);

router.post("/login", login);

router.post("/verifyemail", verifyemail);

router.post("/verifycode", verifycode);

router.put("/updatepassword", updatePassword);

router.post("/reviews", userreview);

router.get("/users/:userId",userbyid );

export default router;

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user and returns the user data with a token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - userType
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's password
 *               userType:
 *                 type: string
 *                 description: User's type
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: User already exists
 * 
 * /api/verify:
 *   post:
 *     summary: Verify user's email
 *     description: This endpoint verifies a user's email by checking the verification code sent via email against the one stored in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - verificationCode
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user to verify.
 *               verificationCode:
 *                 type: string
 *                 description: Verification code sent to the user's email.
 *     responses:
 *       200:
 *         description: Verification successful.
 *       400:
 *         description: Invalid input, object missing required properties email or verificationCode.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 * 
 * /api/login:
 *   post:
 *     summary: Log in a user
 *     description: Allows a user to log in by verifying their email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Registered email of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password of the user.
 *     responses:
 *       200:
 *         description: Login successful. Returns the user data along with a token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The user ID.
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The user's email.
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication purposes.
 *       400:
 *         description: Invalid credentials or incomplete input.
 *       500:
 *         description: Internal Server Error.
 * 
 * /api/verifyemail:
 *   post:
 *     summary: Sends a verification email
 *     description: This endpoint sends a verification email to the user with a 6-digit verification code to verify their email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address to verify.
 *     responses:
 *       200:
 *         description: Verification email sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification email sent successfully.
 *       201:
 *         description: User found and verification email sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *                 message:
 *                   type: string
 *                   example: Verification email sent successfully.
 *       400:
 *         description: Email is required or no user found.
 *       500:
 *         description: Failed to send verification email or internal server error.
 * 
 * /api/verifycode:
 *   post:
 *     summary: Verify the code sent to user's email
 *     description: This endpoint checks the verification code sent to the user's email for password reset or email verification purposes.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - verificationCode
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user to be verified.
 *               verificationCode:
 *                 type: string
 *                 description: Verification code that was sent to the user's email.
 *     responses:
 *       200:
 *         description: Verification successful. User's email is verified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification successful.
 *       400:
 *         description: Missing email or verification code in the request or invalid verification code provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid verification code or missing required fields.
 *       404:
 *         description: Email not found in the database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email not found.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 * 
 * /api/updatepassword:
 *   put:
 *     summary: Update user's password
 *     description: Allows a user to update their password after validating their email address.
 *     tags: [User Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address associated with the user's account.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The new password to set for the user.
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated successfully.
 *       400:
 *         description: Email and new password are required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email and new password are required.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error.
 * 
 * /api/reviews:
 *   post:
 *     summary: Submit a user review
 *     description: Allows users to submit reviews based on their experiences with services.
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - tender_cancel
 *               - auction_experience
 *               - tender_service
 *               - ratings
 *               - comments
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The user ID of the reviewer.
 *               tender_cancel:
 *                 type: boolean
 *                 description: Whether the tender was canceled.
 *               auction_experience:
 *                 type: boolean
 *                 description: User's experience with the auction.
 *               tender_service:
 *                 type: boolean
 *                 description: User's satisfaction with the tender service.
 *               ratings:
 *                 type: object
 *                 additionalProperties:
 *                   type: integer
 *                   description: Ratings provided by the user.
 *               comments:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *                   description: Comments provided by the user.
 *     responses:
 *       201:
 *         description: Review submitted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 tender_cancel:
 *                   type: boolean
 *                 auction_experience:
 *                   type: boolean
 *                 tender_service:
 *                   type: boolean
 *                 ratings:
 *                   type: object
 *                 comments:
 *                   type: object
 *       400:
 *         description: Invalid input, missing fields, or data format issues.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Required field missing or data format incorrect."
 * 
 * /api/users/{userId}:
 *   get:
 *     summary: Retrieve a user and their associated companies
 *     description: Fetches a user by their unique ID and returns the user details along with any associated companies.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user.
 *     responses:
 *       200:
 *         description: User found along with associated companies.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     userType:
 *                       type: string
 *                 companies:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       address:
 *                         type: string
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

