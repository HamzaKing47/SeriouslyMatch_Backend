const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../cloud');
const fs = require('fs'); // File system to delete local files

exports.signup = async (req, res) => {
    try {
        const { name, email, password, dob } = req.body;
        if (!name || !email || !password || !dob) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Validate date format (optional)
        if (isNaN(Date.parse(dob))) {
            return res.status(400).json({ error: "Invalid date of birth format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, dob:dob });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.user = async (req, res) => {
    const user = await User.findById(req.user.userId).select('-password');
    res.json({status:'succes',data:user});
}

exports.updateUser = async (req, res) => {
    const { 
        name, 
        email, 
        dob, 
        country_code, 
        phone, 
        gender, 
        interests, 
        about_me,
        looking_for,
        age_from,
        age_to,
        weight,
        race,
        height
    } = req.body;
    const updateData = { 
        name, 
        email,
        dob, 
        country_code, 
        phone, 
        gender, 
        interests, 
        about_me,
        looking_for,
        age_from,
        age_to,
        weight,
        race,
        height
    };

    if (req?.files?.profilePic) {
        const {secure_url:url, public_id} = await cloudinary.uploader.upload(req?.files.profilePic[0].path)
        updateData.profilePic = {url,public_id,}
        fs.unlinkSync(req.files.profilePic[0].path);
    }

    if (req?.files?.otherPics) {
        const filePaths = req.files.otherPics.map(file => file.path); // Store file paths for deletion

        try {
            updateData.otherPics = await Promise.all(
                req.files.otherPics.map(async (file) => {
                    const result = await cloudinary.uploader.upload(file.path);
                    return { url: result.secure_url, public_id: result.public_id };
                })
            );
    
            // ✅ Now delete all local files AFTER uploads succeed
            filePaths.forEach(path => fs.unlinkSync(path));
    
        } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
        }
    }
    
    const user = await User.findByIdAndUpdate(req.user.userId, updateData, { new: true });
    res.json({status:'succes',data:user});
}

exports.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: 'User deleted successfully' });
}

exports.getProfile = async (req,res) => {
    console.log('Done')
    try {
        const profiles = await User.find();

    res.json({status:'succes',data:profiles});
    } catch (err) {
        console.error('Error fetching profiles by interest:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}