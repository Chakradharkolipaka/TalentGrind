const mongoose = require("mongoose");

// ✅ Connect to "sample_analytics" explicitly
const AccountsSchema = new mongoose.Schema({}, { collection: "accounts" });

const Accounts = mongoose.connection.useDb("sample_analytics").model("Accounts", AccountsSchema);

module.exports = Accounts;
