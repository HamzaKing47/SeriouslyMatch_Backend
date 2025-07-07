const MovieRequest = require('../models/MovieRequest');
const MoviePlan = require('../models/MoviePlan');

exports.sendMovieRequest = async (req, res) => {
  try {
    console.log('🎬 Movie request handler hit');
    const fromUser = req.user.userId;
    const { toUserId } = req.body;

    console.log('📨 Sending to:', toUserId);

    if (!toUserId) {
      console.log('❌ Missing recipient');
      return res.status(400).json({ error: 'Recipient user ID is required' });
    }

    const fromPlan = await MoviePlan.findOne({ user: fromUser });
    const toPlan = await MoviePlan.findOne({ user: toUserId });

    console.log('📅 Plans fetched');

    if (!fromPlan || !toPlan) {
      console.log('❌ Plans not found');
      return res.status(404).json({ error: 'Both users must have a movie plan' });
    }

    // (rest of code...)
  } catch (err) {
    console.error('❌ Send movie request error:', err);
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

    request.status = action;
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
