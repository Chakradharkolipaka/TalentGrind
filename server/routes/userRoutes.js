// routes/userRoutes.js

const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get user profile
// GET user by ID (unauthenticated basic info fetch)
router.get('/user', async (req, res) => {
    const { userId } = req.query;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            name: user.name,
            skillCoins: user.skillCoins,
            avatar: user.avatar || 'https://i.postimg.cc/7ZBcjDqp/user-default.jpg'
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            fullname: user.fullname,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage,
            skills: user.skills,
            projects: user.projects,
            certificates: user.certificates,
            skillCoins: user.skillCoins,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
    const { fullname, bio, skills, projects, certificates } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.fullname = fullname || user.fullname;
        user.bio = bio || user.bio;
        user.skills = skills || user.skills;
        user.projects = projects || user.projects;
        user.certificates = certificates || user.certificates;

        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// routes/userRoutes.js

const multer = require('multer');
const path = require('path');

// Set up Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Save images in the "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Unique filenames
    }
});

const upload = multer({ storage });

// Route to upload profile image
router.post('/uploadProfileImage', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.profileImage = req.file.path;  // Store the image path
        await user.save();

        res.json({ message: 'Profile image updated', imageUrl: req.file.path });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});



//  // POST /api/skillcoins/add
// router.post('/skillcoins/add', authMiddleware, async (req, res) => {
//     const { amount } = req.body;
//     try {
//         const user = await User.findById(req.user.id);
//         user.skillCoins += amount;
//         await user.save();
//         res.json({ message: 'Coins added', skillCoins: user.skillCoins });
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to add coins' });
//     }
// });

// // POST /api/skillcoins/deduct
// router.post('/skillcoins/deduct', authMiddleware, async (req, res) => {
//     const { amount } = req.body;
//     try {
//         const user = await User.findById(req.user.id);
//         if (user.skillCoins < amount) {
//             return res.status(400).json({ error: 'Insufficient coins' });
//         }
//         user.skillCoins -= amount;
//         await user.save();
//         res.json({ message: 'Coins deducted', skillCoins: user.skillCoins });
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to deduct coins' });
//     }
// });


module.exports = router;