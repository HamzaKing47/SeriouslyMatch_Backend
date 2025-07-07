const multer = require('multer');
const path = require('path');

// Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/', 'video/'];
  const isValid = allowedTypes.some(type => file.mimetype.startsWith(type));
  if (isValid) cb(null, true);
  else cb(new Error('Only image and video files are allowed!'), false);
};

// ✅ Correct export: an instance of multer, not a config object
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 }
});

module.exports = upload;
