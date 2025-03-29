const express = require("express");
const User = require("../models/User"); // ✅ Uses "user Authentication" collection
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

// 📌 User Sign-Up API (Registers User)
router.post("/signup", async (req, res) => {
    try {
        const { name, gender, age, mobile_number, email, username, password } = req.body;

        // ✅ Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // ✅ Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create new user in "user Authentication" collection
        const newUser = new User({
            name,
            gender,
            age,
            mobile_number,
            email,
            username,
            password: hashedPassword
        });

        await newUser.save();
        res.json({ success: true, message: "User registered successfully!", userId: newUser._id });

    } catch (error) {
        console.error("❌ Error registering user:", error);
        res.status(500).json({ message: "Error registering user" });
    }
});

// 📌 User Sign-In API (Login & JWT Token)
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        // ✅ Check if user exists in "user Authentication" collection
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        // ✅ Verify Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // ✅ Generate JWT Token
        const token = jwt.sign({ id: user._id }, "SECRET_KEY", { expiresIn: "1h" });

        res.json({ success: true, token, user });
    } catch (error) {
        console.error("❌ Sign-in Error:", error);
        res.status(500).json({ message: "Server error during sign-in" });
    }
});

module.exports = router;
