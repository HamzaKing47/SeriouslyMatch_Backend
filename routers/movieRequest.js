const router = require('express').Router();
const { auth } = require('../middleware/auth');
const {
  sendMovieRequest,
  respondToMovieRequest,
  getIncomingMovieRequests,
  getSentMovieRequests,
  getMatchedMovieUsersForChat
} = require('../controllers/movieRequest');

/**
 * @swagger
 * /api/movie-requests:
 *   post:
 *     summary: Send a movie date request
 *     tags: [Movie Dating]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               toUserId:
 *                 type: string
 *                 description: ID of the user to send the request to
 *             required:
 *               - toUserId
 *     responses:
 *       201:
 *         description: Request sent successfully
 */
router.post('/movie-requests', auth, sendMovieRequest);

/**
 * @swagger
 * /api/movie-requests/{requestId}/respond:
 *   put:
 *     summary: Accept or decline a movie request
 *     tags: [Movie Dating]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the movie request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [accept, decline]
 *                 example: accept
 *     responses:
 *       200:
 *         description: Request updated
 */
router.put('/movie-requests/:requestId/respond', auth, respondToMovieRequest);

/**
 * @swagger
 * /api/movie-requests/incoming:
 *   get:
 *     summary: Get incoming movie requests
 *     tags: [Movie Dating]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of incoming requests
 */
router.get('/movie-requests/incoming', auth, getIncomingMovieRequests);

/**
 * @swagger
 * /api/movie-requests/sent:
 *   get:
 *     summary: Get sent movie requests
 *     tags: [Movie Dating]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sent requests
 */
router.get('/movie-requests/sent', auth, getSentMovieRequests);

/**
 * @swagger
 * /api/movie-requests/matches:
 *   get:
 *     summary: Get matched movie users for chat
 *     tags: [Movie Dating]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of matched users
 */
router.get('/movie-requests/matches', auth, getMatchedMovieUsersForChat);

module.exports = router;
