const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
        skillName: { type: String, required: true },
        category: { type: String, required: true },
        level: { type: String, required: true },
        description: { type: String, required: true },
        availability: { type: String, required: true },
        skillCoins: { type: Number, required: true, min: 10 },
        video: {
            data: Buffer,
            contentType: String
          },
        createdAt: { type: Date, default: Date.now }
    },
    { collection: "skills" } // ✅ Explicitly setting the collection name
);

module.exports = mongoose.model("Skill", SkillSchema);
