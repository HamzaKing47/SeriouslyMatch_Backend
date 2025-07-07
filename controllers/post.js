const cloudinary = require('../cloud');
const fs = require('fs');
const Post = require('../models/post');

exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const mediaFiles = req.files?.media || [];

    if (!content && mediaFiles.length === 0) {
      return res.status(400).json({ error: "Post must include content or media" });
    }

    const post = new Post({
      content,
      user: req.user.userId,
      images: [],
      videos: []
    });

    for (const file of mediaFiles) {
      const isVideo = file.mimetype.startsWith('video/');
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: isVideo ? 'video' : 'image'
      });
      fs.unlinkSync(file.path);

      const mediaObj = { url: result.secure_url, public_id: result.public_id };
      isVideo ? post.videos.push(mediaObj) : post.images.push(mediaObj);
    }

    await post.save();
    res.status(201).json({ status: 'success', data: post });

  } catch (err) {
    console.error('Create Post Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getPosts = async (req, res) => {
  const posts = await Post.find().populate('user', 'name profilePic').sort({ createdAt: -1 });
  res.json({ status: 'success', data: posts });
};

exports.getPostsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ user: userId })
      .populate('user', 'name profilePic')
      .sort({ createdAt: -1 });

    res.json({ status: 'success', data: posts });
  } catch (err) {
    console.error('Get posts by user error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    // Find post owned by the user
    const post = await Post.findOne({ _id: postId, user: userId });
    if (!post) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    // Update content if provided
    if (content) {
      post.content = content;
    }

    // Handle media (images/videos)
    const mediaFiles = req.files?.media || [];
    for (const file of mediaFiles) {
      const isVideo = file.mimetype.startsWith('video/');
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: isVideo ? 'video' : 'image'
      });

      // Delete local file after upload
      fs.unlinkSync(file.path);

      const mediaObj = {
        url: result.secure_url,
        public_id: result.public_id
      };

      if (isVideo) {
        post.videos.push(mediaObj);
      } else {
        post.images.push(mediaObj);
      }
    }

    await post.save();

    res.status(200).json({
      status: 'success',
      message: 'Post updated successfully',
      data: post
    });

  } catch (err) {
    console.error('Update Post Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;

  const post = await Post.findOneAndDelete({ _id: postId, user: userId });
  if (!post) return res.status(404).json({ error: 'Post not found or unauthorized' });

  // Delete image from Cloudinary if exists
  if (post.image?.public_id) {
    await cloudinary.uploader.destroy(post.image.public_id);
  }

  res.json({ status: 'success', message: 'Post deleted' });
};
