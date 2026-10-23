const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/posts?search=&author=&tag=&page=1&limit=9
router.get('/', async (req, res) => {
  try {
    const { search = '', author = '', tag = '', page = 1, limit = 9 } = req.query;
    const query = {};
    if (author) query.author = author;
    if (tag) query.tags = tag;
    if (search) query.$text = { $search: search };

    const pg = Math.max(1, parseInt(page));
    const lim = Math.min(50, Math.max(1, parseInt(limit)));
    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name avatar bio')
      .sort({ createdAt: -1 })
      .skip((pg - 1) * lim)
      .limit(lim)
      .lean();

    // attach comment counts
    const ids = posts.map((p) => p._id);
    const counts = await Comment.aggregate([
      { $match: { post: { $in: ids } } },
      { $group: { _id: '$post', count: { $sum: 1 } } },
    ]);
    const map = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));
    const withCounts = posts.map((p) => ({
      ...p,
      likeCount: p.likes ? p.likes.length : 0,
      commentCount: map[String(p._id)] || 0,
    }));

    res.json({ posts: withCounts, total, page: pg, pages: Math.ceil(total / lim) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/posts/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate('author', 'name avatar bio')
      .sort({ createdAt: -1 })
      .lean();
    res.json(posts.map((p) => ({ ...p, likeCount: p.likes?.length || 0 })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/posts/:id
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name avatar bio createdAt');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const commentCount = await Comment.countDocuments({ post: post._id });
    res.json({ ...post.toObject(), likeCount: post.likes.length, commentCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/posts
router.post(
  '/',
  auth,
  [body('title').trim().notEmpty(), body('content').trim().notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { title, content, excerpt = '', coverImage = '', tags = [] } = req.body;
    try {
      const post = await Post.create({
        title,
        content,
        excerpt: excerpt || content.slice(0, 160),
        coverImage,
        tags: Array.isArray(tags) ? tags : String(tags).split(',').map((t) => t.trim()).filter(Boolean),
        author: req.user._id,
      });
      await post.populate('author', 'name avatar bio');
      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// PUT /api/posts/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (String(post.author) !== String(req.user._id))
      return res.status(403).json({ message: 'Not authorized' });
    const { title, content, excerpt, coverImage, tags } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (tags !== undefined)
      post.tags = Array.isArray(tags) ? tags : String(tags).split(',').map((t) => t.trim()).filter(Boolean);
    await post.save();
    await post.populate('author', 'name avatar bio');
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/posts/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (String(post.author) !== String(req.user._id))
      return res.status(403).json({ message: 'Not authorized' });
    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/posts/:id/like  (toggle)
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const idx = post.likes.findIndex((id) => String(id) === String(req.user._id));
    let liked;
    if (idx === -1) {
      post.likes.push(req.user._id);
      liked = true;
    } else {
      post.likes.splice(idx, 1);
      liked = false;
    }
    await post.save();
    res.json({ liked, likeCount: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
