const cloudinary = require('../cloud');
const streamifier = require('streamifier');

exports.uploadCloudVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'video', folder: 'cloudVideos' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload();

    res.status(201).json({
      status: 'success',
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (err) {
    console.error('Upload to Cloudinary failed:', err);
    res.status(500).json({ error: err.message });
  }
};
