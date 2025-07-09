const MovieRequest = require('../models/MovieRequest');
const MoviePlan = require('../models/MoviePlan')
const User = require('../models/user');

exports.sendMovieRequest = async (req, res) => {
  try {
    const fromUser = req.user.userId;
    const { toUserId } = req.body;

    if (!toUserId) {
      return res.status(400).json({ error: 'Recipient user ID is required' });
    }

    const fromPlan = await MoviePlan.findOne({ user: fromUser });
    const toPlan = await MoviePlan.findOne({ user: toUserId });

    if (!fromPlan || !toPlan) {
      return res.status(404).json({ error: 'Both users must have a movie plan' });
    }

    const sameCinema = fromPlan.cinema === toPlan.cinema;
    const sameDay =
      new Date(fromPlan.showtime).toDateString() === new Date(toPlan.showtime).toDateString();

    if (!sameCinema || !sameDay) {
      return res
        .status(400)
        .json({ error: 'Users must have matching movie plans (same cinema and day)' });
    }

    const existing = await MovieRequest.findOne({
      fromUser,
      toUser: toUserId,
      plan: fromPlan._id,
    });

    if (existing) {
      return res.status(400).json({ error: 'Request already sent' });
    }

    const request = new MovieRequest({
      fromUser,
      toUser: toUserId,
      plan: fromPlan._id,
    });

    await request.save();
    res.status(201).json({ status: 'success', data: request });
  } catch (err) {
    console.error('Send movie request error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.respondToMovieRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body;
    const userId = req.user.userId;

    if (!['accept', 'decline'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const request = await MovieRequest.findOne({ _id: requestId, toUser: userId });
    if (!request) {
      return res.status(404).json({ error: 'Request not found or unauthorized' });
    }

    // ✅ Map action to enum-compliant value
    request.status = action === 'accept' ? 'accepted' : 'declined';
    await request.save();

    res.json({ status: 'success', data: request });

  } catch (err) {
    console.error('Respond movie request error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getIncomingMovieRequests = async (req, res) => {
  try {
    const requests = await MovieRequest.find({ toUser: req.user.userId })
      .populate('fromUser', 'name profilePic')
      .populate('plan');

    res.json({ status: 'success', data: requests });
  } catch (err) {
    console.error('Get incoming movie requests error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getSentMovieRequests = async (req, res) => {
  try {
    const requests = await MovieRequest.find({ fromUser: req.user.userId })
      .populate('toUser', 'name profilePic')
      .populate('plan');

    res.json({ status: 'success', data: requests });
  } catch (err) {
    console.error('Get sent movie requests error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.cancelMovieRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const deleted = await MovieRequest.findOneAndDelete({
      _id: requestId,
      fromUser: req.user.userId
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Request not found or unauthorized' });
    }

    res.json({ status: 'success', message: 'Request cancelled' });
  } catch (err) {
    console.error('Cancel movie request error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getMatchedMovieUsersForChat = async (req, res) => {
  try {
    const userId = req.user.userId;

    const acceptedRequests = await MovieRequest.find({
      status: 'accepted',
      $or: [
        { fromUser: userId },
        { toUser: userId }
      ]
    });

    const matchedUserIds = acceptedRequests.map(req =>
      req.fromUser.toString() === userId ? req.toUser : req.fromUser
    );

    const users = await User.find({ _id: { $in: matchedUserIds } })
      .select('name profilePic email');

    res.json({ status: 'success', data: users });
  } catch (err) {
    console.error('Get matched movie users error:', err);
    res.status(500).json({ error: err.message });
  }
};