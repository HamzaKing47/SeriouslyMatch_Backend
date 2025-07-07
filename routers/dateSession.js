const { getPartnerLocation, updateLocation, createDateSession } = require("../controllers/dateSession.js");
const { auth } = require("../middleware/auth.js")

const router = require('express').Router();

/**
 * @swagger
 * /api/date-session:
 *   post:
 *     summary: Create a date session with another user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               partnerId:
 *                 type: string
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Date session created
 *       400:
 *         description: Missing partner or expiration
 */
console.log('🔍 createDateSession is:', typeof createDateSession); // should be "function"
router.post('/date-session', auth, createDateSession);

/**
 * @swagger
 * /api/update-location:
 *   post:
 *     summary: Update current user’s live location
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *     responses:
 *       200:
 *         description: Location updated
 *       403:
 *         description: Session expired or not active
 */
router.post('/update-location', auth, updateLocation);

/**
 * @swagger
 * /api/live-location:
 *   get:
 *     summary: Get live location of partner during a date session
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Partner location retrieved
 *       403:
 *         description: Session not active
 *       404:
 *         description: Partner not found or no location
 */
router.get('/live-location', auth, getPartnerLocation);

module.exports = router;