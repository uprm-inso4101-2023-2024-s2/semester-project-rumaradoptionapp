const petImageDao = require('../dao/Petimage');
const { supabase } = require('../config/config'); // Adjust the path as needed
const multer = require('multer');
const upload = multer({ dest: 'imageProfileUploads/' }); // Using 'imageProfileUploads/' for temporary storage
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink); // promisify the unlink function for async/await


// Middleware for route to handle file upload
const uploadMiddleware = upload.single('image');

const addPetImage = async (req, res) => {
  try {
    const { pet_id } = req.params;
    const { file } = req;

    // Upload file to Supabase Storage and retrieve URL
    const path = `images/${Date.now()}-${file.originalname}`;
    const { error: uploadError } = await supabase.storage
      .from('pet-images')
      .upload(path, file.buffer, {
        contentType: file.mimetype,
      });

    // Retrieve the public URL for the uploaded file
    const { publicURL, error } = supabase.storage.from('pet-images').getPublicUrl(path);

    if (error) {
      throw error;
    }
    // Store the image URL in the database
    const result = await petImageDao.addPetImage(pet_id, publicURL);

    // Delete the temporary file
    await unlinkFile(file.path);

    // Send the result back
    res.json(result);
  } catch (error) {
    // If there's an error, make sure you don't leave the temporary file behind
    if (file) {
      await unlinkFile(file.path).catch((cleanupError) => {
        console.error("Failed to clean up temporary file:", cleanupError);
      });
    }

    res.status(500).json({ error: error.message });
  }
};

const deletePetImage = async (req, res) => {
  try {
    const { image_id } = req.params;
    const result = await petImageDao.deletePetImage(image_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPetImages = async (req, res) => {
  try {
    const { pet_id } = req.params;
    const result = await petImageDao.getAllPetImages(pet_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNewestPetImage = async (req, res) => {
  try {
    const { pet_id } = req.params;
    const result = await petImageDao.getNewestPetImage(pet_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadMiddleware,
  addPetImage,
  deletePetImage,
  getAllPetImages,
  getNewestPetImage
};
