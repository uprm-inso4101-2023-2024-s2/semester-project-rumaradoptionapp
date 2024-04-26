const { supabase } = require('../config/config');

const addPetImage = async (pet_id, image_url) => {
  const { data, error } = await supabase
    .from('pet_images')
    .insert([{ pet_id, image_url }]);
  
  if (error) {
    throw error;
  }

  return data;
};

const deletePetImage = async (image_id) => {
  const { data, error } = await supabase
    .from('pet_images')
    .delete()
    .match({ image_id });
  
  if (error) {
    throw error;
  }

  return data;
};

const getAllPetImages = async (pet_id) => {
  const { data, error } = await supabase
    .from('pet_images')
    .select('image_url')
    .eq('pet_id', pet_id);
  
  if (error) {
    throw error;
  }

  return data;
};

const getNewestPetImage = async (pet_id) => {
  const { data, error } = await supabase
    .from('pet_images')
    .select('image_url')
    .eq('pet_id', pet_id)
    .order('image_id', { ascending: false })
    .limit(1);
  
  if (error) {
    throw error;
  }

  return data.length > 0 ? data[0] : null;
};

module.exports = {
  addPetImage,
  deletePetImage,
  getAllPetImages,
  getNewestPetImage
};