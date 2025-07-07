const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    name: {
        type: String
    },
    country_code: {
        type: String
    },
    phone: {
        type: String
    },
    name: {
        type: String
    },
    dob: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    gender: {
        type: String
    },
    interests: {
        type: [String],
        default: []
    },
    about_me: {
        type: String
    },
    looking_for: {
        type: String
    },
    age_from: {
        type: String
    },
    age_to: {
        type: String
    },
    weight: {
        type: Number
    },
    race: {
        type: String
    },
    height: {
        type: String
    },
    location: {
        type: String
    },
    latitude: {
        type: String
    },
    longitude: {
        type: String
    },
    profilePic: {
        type: Object,
        url: {
            type: URL,
            // required : true,
        },
        public_id: {
            type: String,
            // required : true,
        },
    },
    otherPics: [
        {
            url: String,
            public_id: String
        }
    ],
    dateSession: {
        withUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        expiresAt: Date,
        location: {
            lat: Number,
            lng: Number
        }
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', postSchema)