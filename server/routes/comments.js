const express = require('express');
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/comments/post/:postId
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/comments/post/:postId
router.post(
  '/post/:postId',
  auth,
  [body('text').trim().notEmpty().isLength({ max: 1000 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) return res.status(404).json({ message: 'Post not found' });
      const comment = await Comment.create({
        text: req.body.text,
        author: req.user._id,
        post: post._id,
      });
      await comment.populate('author', 'name avatar');
      res.status(201).json(comment);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// DELETE /api/comments/:id (comment author or post author)
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('post');
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    const isCommentAuthor = String(comment.author) === String(req.user._id);
    const isPostAuthor = comment.post && String(comment.post.author) === String(req.user._id);
    if (!isCommentAuthor && !isPostAuthor)
      return res.status(403).json({ message: 'Not authorized' });
    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
