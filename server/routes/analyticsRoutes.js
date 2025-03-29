const express = require("express");
const Accounts = require("../models/Accounts");
const router = express.Router();

// Fetch all accounts from "sample_analytics"
router.get("/accounts", async (req, res) => {
    try {
        const accounts = await Accounts.find().limit(10);
        console.log("Fetched Accounts:", accounts); // ✅ Debugging output
        res.json(accounts);
    } catch (error) {
        console.error("❌ Error fetching accounts:", error);
        res.status(500).json({ message: "Error fetching accounts data" });
    }
});

module.exports = router;
