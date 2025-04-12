const mongoose = require("mongoose");

// ✅ Connect to "TalentGrind" database explicitly
const userDb = mongoose.connection.useDb("TalentGrind");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: String,
    age: Number,
    mobile_number: String,
    email:{ type: String, required: true, unique: true },
    username: String,
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    skillCoins: { type: Number, default: 100 }
}, { collection: "user Authentication" }); // ✅ Use "user Authentication" collection

const User = userDb.model("User", UserSchema);

module.exports = User;
