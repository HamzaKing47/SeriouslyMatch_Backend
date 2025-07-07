const { createTravelPlan, findMatches } = require('../controllers/travelPlan');
const { auth } = require('../middleware/auth');

const router = require('express').Router();

/**
 * @swagger
 * /api/travel-plans:
 *   post:
 *     summary: Submit a new travel plan
 *     tags: [Travel Dating]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               from:
 *                 type: string
 *               to:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Travel plan created successfully
 */
router.post('/travel-plans', auth, createTravelPlan);

/**
 * @swagger
 * /api/travel-plans/matches:
 *   get:
 *     summary: Find users with same travel date, from and to locations
 *     tags: [Travel Dating]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Matched travel plans with user info
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Current user's travel plan not found
 */
router.get('/travel-plans/matches', auth, findMatches);


module.exports = router;
