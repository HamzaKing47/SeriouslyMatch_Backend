const MoviePlan = require('../models/MoviePlan');

exports.createMoviePlan = async (req, res) => {
    try {
        const { cinema, movieTitle, showtime, notes } = req.body;

        if (!cinema || !movieTitle || !showtime) {
            return res.status(400).json({ error: 'Cinema, movie title, and showtime are required' });
        }

        // Delete previous movie plans of the user (like travel module)
        await MoviePlan.deleteMany({ user: req.user.userId });

        const plan = new MoviePlan({
            user: req.user.userId,
            cinema,
            movieTitle,
            showtime,
            notes,
        });

        await plan.save();

        res.status(201).json({ status: 'success', data: plan });
    } catch (err) {
        console.error('Create movie plan error:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.findMovieMatches = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get the current user's movie plan
        const userPlan = await MoviePlan.findOne({ user: userId });
        if (!userPlan) {
            return res.status(404).json({ error: "Your movie plan not found" });
        }

        // Define start and end of the selected day
        const startOfDay = new Date(userPlan.showtime);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(userPlan.showtime);
        endOfDay.setHours(23, 59, 59, 999);

        // Find other users with the same cinema, same date (but not the current user)
        const matches = await MoviePlan.find({
            user: { $ne: userId },
            cinema: userPlan.cinema,
            showtime: { $gte: startOfDay, $lte: endOfDay }
        })
            .populate('user', 'name profilePic')
            .sort({
                showtime: 1
            });

        res.json({ status: 'success', data: matches });
    } catch (err) {
        console.error('Find movie matches error:', err);
        res.status(500).json({ error: err.message });
    }
};
