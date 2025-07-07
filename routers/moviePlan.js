const { createMoviePlan, findMovieMatches } = require("../controllers/moviePlan");
const { auth } = require("../middleware/auth");

const router = require('express').Router();

/**
 * @swagger
 * /api/movie-plans:
 *   post:
 *     summary: Create a new movie dating plan
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
 *               cinema:
 *                 type: string
 *               movieTitle:
 *                 type: string
 *               showtime:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *             required:
 *               - cinema
 *               - movieTitle
 *               - showtime
 *     responses:
 *       201:
 *         description: Movie plan created successfully
 *       400:
 *         description: Missing required fields
 */
router.post('/movie-plans', auth, createMoviePlan);

/**
 * @swagger
 * /api/movie-plans/matches:
 *   get:
 *     summary: Find users going to the same cinema on the same day
 *     tags: [Movie Dating]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of matched movie plans
 *       404:
 *         description: User's movie plan not found
 */
router.get('/movie-plans/matches', auth, findMovieMatches);

module.exports = router;