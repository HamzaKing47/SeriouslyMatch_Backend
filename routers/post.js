const { auth } = require('../middleware/auth.js');
const upload = require('../middleware/multer.js');
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPostsByUserId
} = require('../controllers/post.js');

const router = require('express').Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: User-generated posts (text, images, and videos)
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of posts
 */
router.get('/posts', auth, getPosts)

/**
 * @swagger
 * /api/posts/user/{userId}:
 *   get:
 *     summary: Get all posts by a specific user
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []  
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to get posts for
 *     responses:
 *       200:
 *         description: A list of posts by the user
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       404:
 *         description: User or posts not found
 */
router.get('/posts/user/:userId', auth, getPostsByUserId);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post with optional images or videos
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Having fun at the beach!"
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *             required:
 *               - content
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/posts', auth, upload.fields([{ name: 'media', maxCount: 10 }]), createPost);

/**
 * @swagger
 * /api/posts/{postId}:
 *   put:
 *     summary: Update post content or media
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
router.put(
  '/posts/:postId',
  auth,
  upload.fields([{ name: 'media', maxCount: 10 }]),
  updatePost
);

/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found or unauthorized
 */
router.delete('/posts/:postId', auth, deletePost);

module.exports = router;
