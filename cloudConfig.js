const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure cloudinary
// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,  
  api_key: process.env.CLOUD_API_KEY,  
  api_secret: process.env.CLOUD_API_SECRET  
});
// Create storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Roamly_DEV',
    allowedFormats: ['jpeg', 'png', 'jpg']
  }
});

module.exports = {
  cloudinary,
  storage
};