import ForgetPassword from "../model/forgetpassword.js";
import User from "../model/user.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import UserReview from "../model/userreview.js";
import Company from "../model/company.js";

export const register = async (req, res) => {
  try {
    // Get user input
    const { name, email, password,userType } = req.body;

    // Validate user input
    if (!(email && password && name && userType)) {
      return res.status(400).send("All input is required");
    }

    // check if user already exists
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exists. Please Login");
    }

    // Generate 6-digit verification code
    const verificationToken = Math.floor(100000 + Math.random() * 900000);

    // Encrypt user password
    const encryptedUserPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password:encryptedUserPassword,
      isVerified: false,
      userType,
      verificationToken,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.JWT_SECRET,
      {
        expiresIn: "5h",
      }
    );

    // save user token
    user.token = token;

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "developeralimirza786@gmail.com",
        pass: "osxeibunqfbpxqxe",
      },
    });

    const mailOptions = {
      from: "developeralimirza786@gmail.com",
      to: email,
      subject: "Email Verification",
      text: `Your verification code is: ${verificationToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        
        return res.status(500).send("Failed to send verification email");
      }
      
      return res.status(201).json(user);
    });
  } catch (err) {
    
    return res.status(500).send("Internal Server Error");
  }
};

export const verify = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    // Validate user input
    if (!(email && verificationCode)) {
      return res.status(400).send("Email and verification code are required");
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if the verification code matches
    if (user.verificationToken !== verificationCode) {
      return res.status(400).send("Invalid verification code");
    }

    // Update user's isVerified status
    user.isVerified = true;

    // Save the updated user
    await user.save();

    return res.status(200).send("Verification successful");
  } catch (err) {
    
    return res.status(500).send("Internal Server Error");
  }
};

export const login = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && user.isVerified && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.JWT_SECRET,
        {
          expiresIn: "5h",
        }
      );

      // save user token
      user.token = token;

      // user
      return res.status(200).json(user);
    } else {
      return res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    
  }
};

export const verifyemail = async (req, res) => {
  try {
    // Get user input
    const { email } = req.body;

    // Validate user input
    if (!email) {
      return res.status(400).send("Email is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user) {
      // Generate 6-digit verification code
      const verificationToken = Math.floor(100000 + Math.random() * 900000);

      // Create user in our database
      const forgetpassword = await ForgetPassword.create({
        email: email.toLowerCase(),
        isVerified: false,
        verificationToken,
      });

      // Create token
      const token = jwt.sign(
        { user_id: forgetpassword._id, email },
        process.env.JWT_SECRET,
        {
          expiresIn: "5h",
        }
      );

      // save user token
      forgetpassword.token = token;

      // Send verification email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "developeralimirza786@gmail.com",
          pass: "osxeibunqfbpxqxe",
        },
      });

      const mailOptions = {
        from: "developeralimirza786@gmail.com",
        to: email,
        subject: "Email Verification",
        text: `Your verification code is: ${verificationToken}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          
          return res.status(500).send("Failed to send verification email");
        }
        
        return res.status(201).json(user);
      });
      return res.status(200);
    } else {
      return res.status(400).send("No user found");
    }
  } catch (err) {
    
  }
};

export const verifycode = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    // Validate user input
    if (!(email && verificationCode)) {
      return res.status(400).send("Email and verification code are required");
    }

    // Find the user by email
    const forgetpassword = await ForgetPassword.findOne({ email });

    // Check if the user exists
    if (!forgetpassword) {
      return res.status(404).send("Email not found");
    }

    // Check if the verification code matches
    if (forgetpassword.verificationToken !== verificationCode) {
      return res.status(400).send("Invalid verification code");
    }

    // Update user's isVerified status
    forgetpassword.isVerified = true;

    // Save the updated user
    await forgetpassword.save();

    return res.status(200).send("Verification successful");
  } catch (err) {
    
    return res.status(500).send("Internal Server Error");
  }
};

export const updatePassword = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("Email and new password are required");
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Encrypt new password
    const encryptedNewPassword = await bcrypt.hash(password, 10);

    // Update user's password
    user.password = encryptedNewPassword;

    // Save the updated user
    await user.save();

    return res.status(200).send("Password updated successfully");
  } catch (err) {
    
    return res.status(500).send("Internal Server Error");
  }
};

export const userreview=async (req, res) => {
  const { userId, tender_cancel, auction_experience, tender_service, ratings, comments } = req.body;
  
  try {
    const newReview = new UserReview({
      userId,
      tender_cancel,
      auction_experience,
      tender_service,
      ratings,
      comments
    });
    
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const userbyid=async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ userId: userId });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const companies = await Company.find({ userId: user.userId });

    res.status(200).json({
      user,
      companies,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}