import express from "express";
import bcrypt from "bcrypt";
import { User } from "../../models/User.js";
import jwt from "jsonwebtoken";


const router = express.Router();

// Sigup a new user
router.post("/signup", async (req, res, next) => {
    const {fullName, email, password} = req.body;

    if(!fullName || !email || !password) {
        return res.status(400).json({
            error: true,
            message: "All fields are required!"
        });
    }

    try {
        const existingUser = await User.findOne({email})

        if (existingUser) {
          return res.status(409).json({
            error: true,
            message: "Email already in use!",
          });
        }
            const user = await User.create({fullName, email, password});

            res
                .status(201)
                .json({error: false, message: "User registered successfully!"});
    }   catch (err) {
        next(err);
    }
});

//  Login a user
router.post("/login", async (req, res, next) => {
    const {email, password} = req.body;

if(!email || !password) {
    return res.status(400).json({
        error: true,
        message : "Email and password are required!"
    });
};

try {
    const user = await User.findOne({email})

    if(!user) {
        return res.status(401).json({
            error: true,
            message: "Invalid credentials!",
        });
    };

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return res.status(401).json({
            error: true,
            message: "Invalid credentials!",
        });
    };

    // Generate JWT (token)
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"})

    const isProd = process.env.NODE_ENV === "production"

    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
        maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({
        error: false,
        message: "Login successful!",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
        },
    });

    }   catch (err) {
    next (err);
    }

});

// Verify token
router.get("/verify", async (req, res, next) => {
    const token = req.headers.authorization.split(" ") [1]

    if(!token) {
        return res.status(401).json({
            error: true,
            message: "Token is required!"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        res.status(200).json({
            error: false,
            userId: decoded.userId,
            massage: "Token is valid ✅",
        });
    }   catch (err)   {
        next(err);
    }
});

// Logout
router.post("/logout", (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE==="production",
        sameSite: "Strict"
    });

    res.status(200).json({
        message: "Logged out successfully! 👋"
    })
})
export default router;