const mongoose = require("mongoose");

// ✅ Connect to "TalentGrind" database explicitly
const userDb = mongoose.connection.useDb("TalentGrind");

const UserSchema = new mongoose.Schema({
    name: String,
    gender: String,
    age: Number,
    mobile_number: String,
    email: String,
    username: String,
    password: String
}, { collection: "user Authentication" }); // ✅ Use "user Authentication" collection

const User = userDb.model("User", UserSchema);

module.exports = User;
