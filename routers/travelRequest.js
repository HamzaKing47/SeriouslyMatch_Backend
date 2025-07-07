const { auth } = require('../middleware/auth');
const { sendTravelRequest, respondToTravelRequest, getIncomingRequests, getSentRequests, cancelTravelRequest, getMatchedUsersForChat } = require('../controllers/travelRequest');

const router = require('express').Router();

/**
 * @swagger
 * /api/travel-requests:
 *   post:
 *     summary: Send a travel request to another user
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
 *               recipientId:
 *                 type: string
 *                 description: ID of the user you want to send a travel request to
 *               message:
 *                 type: string
 *                 description: Optional message to include with the request
 *             required:
 *               - recipientId
 *     responses:
 *       201:
 *         description: Travel request sent successfully
 *       400:
 *         description: Bad request (missing fields or self-request)
 *       401:
 *         description: Unauthorized
 */
router.post('/travel-requests', auth, sendTravelRequest);

/**
 * @swagger
 * /api/requests/{requestId}/respond:
 *   put:
 *     summary: Accept or decline a travel request
 *     tags: [Travel Dating]  # ✅ Keeping it under existing tag
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the travel request to respond to
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
 *         description: Travel request updated successfully
 *       400:
 *         description: Invalid action or bad request
 *       404:
 *         description: Request not found or unauthorized
 */
router.put('/requests/:requestId/respond', auth, respondToTravelRequest);

/**
 * @swagger
 * /api/requests/incoming:
 *   get:
 *     summary: Get all incoming travel requests
 *     tags: [Travel Dating]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of incoming requests
 *       401:
 *         description: Unauthorized
 */
router.get('/requests/incoming', auth, getIncomingRequests);

/**
 * @swagger
 * /api/requests/sent:
 *   get:
 *     summary: Get all travel requests sent by the logged-in user
 *     tags: [Travel Dating]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sent requests
 *       401:
 *         description: Unauthorized
 */
router.get('/requests/sent', auth, getSentRequests);

/**
 * @swagger
 * /api/requests/{requestId}:
 *   delete:
 *     summary: Cancel a travel request (only by sender)
 *     tags: [Travel Dating]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the travel request to cancel
 *     responses:
 *       200:
 *         description: Request cancelled successfully
 *       404:
 *         description: Request not found or unauthorized
 */
router.delete('/requests/:requestId', auth, cancelTravelRequest);

/**
 * @swagger
 * /api/matches:
 *   get:
 *     summary: Get users you matched with (accepted travel requests)
 *     tags: [Travel Dating]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of matched users
 *       401:
 *         description: Unauthorized
 */
router.get('/matches', auth, getMatchedUsersForChat);

module.exports = router;
