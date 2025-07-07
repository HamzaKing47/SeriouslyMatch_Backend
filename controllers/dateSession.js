const User = require("../models/user.js");

module.exports = {
  createDateSession: async (req, res) => {
    const { partnerId, expiresAt } = req.body;
    if (!partnerId || !expiresAt) {
        return res.status(400).json({ error: 'Partner ID and expiration time are required' });
    }

    const currentUser = await User.findById(req.user.userId);
    const partnerUser = await User.findById(partnerId);
    if (!partnerUser) return res.status(404).json({ error: 'Partner not found' });

    currentUser.dateSession = {
        withUser: partnerUser._id,
        expiresAt: new Date(expiresAt)
    };
    partnerUser.dateSession = {
        withUser: currentUser._id,
        expiresAt: new Date(expiresAt)
    };

    await currentUser.save();
    await partnerUser.save();

    res.json({ status: 'success', message: 'Date session started' });
  },

  updateLocation: async (req, res) => {
    const { lat, lng } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user.dateSession || new Date() > new Date(user.dateSession.expiresAt)) {
        return res.status(403).json({ error: 'Date session is not active or has expired' });
    }

    user.dateSession.location = { lat, lng };
    await user.save();
    res.json({ status: 'success', message: 'Location updated' });
  },

  getPartnerLocation: async (req, res) => {
    const user = await User.findById(req.user.userId);
    if (!user.dateSession || new Date() > new Date(user.dateSession.expiresAt)) {
        return res.status(403).json({ error: 'Date session is not active or has expired' });
    }

    const partner = await User.findById(user.dateSession.withUser);
    if (!partner || !partner.dateSession?.location) {
        return res.status(404).json({ error: 'Partner location not available' });
    }

    res.json({
        status: 'success',
        partnerId: partner._id,
        location: partner.dateSession.location
    });
  }
};
