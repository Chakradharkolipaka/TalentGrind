const express = require("express");
const User = require("../models/User"); // ✅ Uses "user Authentication" collection
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
// const SkillCoin = require("../models/SkillCoin");

// After user.save()
// await SkillCoin.create({ userId: user._id });


// 📌 User Sign-Up API (Registers User)
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, age, gender } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // ✅ Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create new user
        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            age,
            gender
        });

        await newUser.save();

        // ✅ Generate Token
        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        res.status(201).json({ 
            success: true, 
            message: "User registered successfully!", 
            token, 
            user: { _id: newUser._id, name, email, age, gender } 
        });
    } catch (error) {
        console.error("❌ Signup Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// 📌 User Sign-In API (Login & JWT Token)
router.post("/signin", async (req, res) => {
    try {
        console.log("🔍 Received request body:", req.body);

        const { email, password } = req.body;
        if (!email || !password) {
            console.error("❌ Missing email or password in request body");
            return res.status(400).json({ message: "Email and password are required" });
        }

        console.log("🔍 Searching for user with email:", email.toLowerCase());

        // ✅ Check if user exists
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).json({ message: "User not found" });

        // ✅ Verify Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        console.log("✅ Password matched");

        // ✅ Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        res.json({ success: true, token, user });
    } catch (error) {
        console.error("❌ Sign-in Error:", error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
});
router.get("/user/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("❌ Error fetching user:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
