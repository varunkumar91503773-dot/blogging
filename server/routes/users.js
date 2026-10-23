const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/users/:id — public author profile + posts
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({
      user,
      stats: {
        postCount: posts.length,
        totalLikes: posts.reduce((n, p) => n + (p.likes?.length || 0), 0),
      },
      posts: posts.map((p) => ({ ...p, likeCount: p.likes?.length || 0 })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/profile
router.put('/profile/update', auth, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    if (name !== undefined) req.user.name = name;
    if (bio !== undefined) req.user.bio = bio;
    if (avatar !== undefined) req.user.avatar = avatar;
    await req.user.save();
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
