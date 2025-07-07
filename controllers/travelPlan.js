const TravelPlan = require("../models/TravelPlan");

exports.createTravelPlan = async (req, res) => {
  try {
    const { from, to, date, notes } = req.body;

    if (!from || !to || !date) {
      return res.status(400).json({ error: 'From, to, and date are required' });
    }

    const userId = req.user.userId;

    // 🧹 Delete all existing travel plans by the same user
    await TravelPlan.deleteMany({ user: userId });

    // ✏️ Create the new plan
    const plan = new TravelPlan({
      user: userId,
      from,
      to,
      date,
      notes
    });

    await plan.save();
    res.status(201).json({ status: 'success', data: plan });
  } catch (err) {
    console.error('Create travel plan error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.findMatches = async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    // Get the travel plan of the current user
    const userPlan = await TravelPlan.findOne({ user: currentUserId });
    if (!userPlan) {
      return res.status(404).json({ error: 'Your travel plan not found' });
    }

    // Calculate start and end of that specific day
    const dateStart = new Date(userPlan.date);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(userPlan.date);
    dateEnd.setHours(23, 59, 59, 999);

    // Find other users with matching from/to and same exact day
    const matches = await TravelPlan.find({
      user: { $ne: currentUserId },
      from: userPlan.from,
      to: userPlan.to,
      date: { $gte: dateStart, $lte: dateEnd }
    }).populate('user', 'name email profilePic'); // Fetch related user info

    res.json({ status: 'success', data: matches });
  } catch (err) {
    console.error('Find matches error:', err);
    res.status(500).json({ error: err.message });
  }
};