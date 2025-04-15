const jwt = require('jsonwebtoken');

// Middleware for Authentication
exports.auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ error: 'Access denied' });
    console.log(authHeader)
    console.log(process.env.JWT_SECRET)
    try {
        const tokenParts = authHeader.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            console.log("❌ Invalid token format");
            return res.status(400).json({ error: "Invalid token format" });
        }

        const token = tokenParts[1]; // Extract actual token
        console.log("🔍 Verifying token with secret:", process.env.JWT_SECRET);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token verified successfully:", verified);

        // const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        console.log('ERR',err.message)
        res.status(400).json({ error: 'Invalid token' });
    }
};