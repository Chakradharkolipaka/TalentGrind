const express = require("express");
const router = express.Router();
const multer = require("multer");
const Skill = require("../models/Skill");

// Setup Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/teach-skill", upload.single("video"), async (req, res) => {
  try {
    const { userId, skillName, category, level, description, availability, skillCoins } = req.body;

    if (!userId || !skillName || !description || !availability || skillCoins < 10 || !req.file) {
      return res.status(400).json({ message: "Required fields are missing!" });
    }

    const newSkill = new Skill({
      userId,
      skillName,
      category,
      level,
      description,
      availability,
      skillCoins,
      video: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });

    await newSkill.save();
    res.status(201).json({ message: "✅ Skill and video saved successfully!" });
  } catch (error) {
    console.error("❌ Error saving skill:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// Inside teachSkillRoutes.js or another route file
// ✅ Move this to teachSkillRoutes.js
router.get("/skills", async (req, res) => {
    try {
      const { search } = req.query;
  
      let filter = {};
      if (search) {
        filter = {
          $or: [
            { skillName: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
          ]
        };
      }
  
      const skills = await Skill.find(filter);
      res.json(skills);
    } catch (error) {
      res.status(500).json({ error: "Error fetching skills" });
    }
  });
  // Route: GET /api/skills/video/:id
router.get("/skills/video/:id", async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill || !skill.video || !skill.video.data) {
            return res.status(404).send("Video not found");
        }

        res.set("Content-Type", skill.video.contentType);
        res.send(skill.video.data); // ✅ Send video buffer directly
    } catch (error) {
        console.error("❌ Error streaming video:", error.message);
        res.status(500).send("Server error");
    }
});

  
  

module.exports = router;
