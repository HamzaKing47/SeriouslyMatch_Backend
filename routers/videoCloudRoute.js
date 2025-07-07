const express = require('express');
const cloudMulter = require('../middleware/cloudMulter');
const { uploadCloudVideo } = require('../controllers/videoCloudController');

const router = express.Router();

/**
 * @swagger
 * /api/upload-cloud-video:
 *   post:
 *     summary: Upload a video file directly to Cloudinary
 *     tags: [Video Upload]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Video file to upload
 *     responses:
 *       201:
 *         description: Video uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 url:
 *                   type: string
 *                   example: https://res.cloudinary.com/your-cloud/video/upload/v12345/sample.mp4
 *                 public_id:
 *                   type: string
 *                   example: cloudVideos/sample_video
 *       400:
 *         description: No video file provided
 *       500:
 *         description: Internal server error
 */
router.post('/upload-cloud-video', cloudMulter.single('video'), uploadCloudVideo);

module.exports = router;
