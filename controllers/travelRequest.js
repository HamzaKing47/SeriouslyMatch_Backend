const TravelRequest = require('../models/TravelRequest');
const TravelPlan = require('../models/TravelPlan');
const User = require('../models/user');

exports.sendTravelRequest = async (req, res) => {
  try {
    const fromUser = req.user.userId;
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ error: 'Recipient user ID is required' });
    }

    // Check if both users have travel plans on the same date
    const fromPlan = await TravelPlan.findOne({ user: fromUser });
    const toPlan = await TravelPlan.findOne({ user: recipientId });

    if (!fromPlan || !toPlan) {
      return res.status(404).json({ error: 'Both users must have a travel plan' });
    }

    // Ensure same from, to and date
    const sameDay = new Date(fromPlan.date).toDateString() === new Date(toPlan.date).toDateString();
    const sameRoute = fromPlan.from === toPlan.from && fromPlan.to === toPlan.to;

    if (!sameDay || !sameRoute) {
      return res.status(400).json({ error: 'Users must have matching travel plans' });
    }

    // Prevent duplicate requests
    const existing = await TravelRequest.findOne({
      fromUser,
      toUser: recipientId,
      plan: fromPlan._id
    });
    if (existing) {
      return res.status(400).json({ error: 'Request already sent' });
    }

    const request = new TravelRequest({
      fromUser,
      toUser: recipientId,
      plan: fromPlan._id
    });

    await request.save();
    res.status(201).json({ status: 'success', data: request });

  } catch (err) {
    console.error('Send travel request error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.respondToTravelRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body;
    const userId = req.user.userId;

    if (!['accept', 'decline'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const request = await TravelRequest.findOne({ _id: requestId, toUser: userId });
    if (!request) {
      return res.status(404).json({ error: 'Request not found or unauthorized' });
    }

    request.status = action === 'accept' ? 'accepted' : 'declined';
    await request.save();

    res.json({ status: 'success', data: request });
  } catch (err) {
    console.error('Respond to request error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getIncomingRequests = async (req, res) => {
  try {
    const userId = req.user.userId;

    const requests = await TravelRequest.find({ toUser: userId })
      .populate('fromUser', 'name email profilePic')
      .populate('plan');

    res.json({ status: 'success', data: requests });
  } catch (err) {
    console.error('Incoming requests error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getSentRequests = async (req, res) => {
  try {
    const userId = req.user.userId;

    const requests = await TravelRequest.find({ fromUser: userId })
      .populate('toUser', 'name email profilePic')
      .populate('plan');

    res.json({ status: 'success', data: requests });
  } catch (err) {
    console.error('Sent requests error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.cancelTravelRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { requestId } = req.params;

    const request = await TravelRequest.findOneAndDelete({
      _id: requestId,
      fromUser: userId
    });

    if (!request) {
      return res.status(404).json({ error: 'Request not found or unauthorized' });
    }

    res.json({ status: 'success', message: 'Request cancelled successfully' });
  } catch (err) {
    console.error('Cancel request error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getMatchedUsersForChat = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find accepted requests where the user is involved
    const acceptedRequests = await TravelRequest.find({
      status: 'accepted',
      $or: [
        { fromUser: userId },
        { toUser: userId }
      ]
    });

    // Get the matched user IDs (not current user)
    const matchedUserIds = acceptedRequests.map(req =>
      req.fromUser.toString() === userId ? req.toUser : req.fromUser
    );

    const users = await User.find({ _id: { $in: matchedUserIds } })
      .select('name profilePic email');

    res.json({ status: 'success', data: users });
  } catch (err) {
    console.error('Get matched users error:', err);
    res.status(500).json({ error: err.message });
  }
};