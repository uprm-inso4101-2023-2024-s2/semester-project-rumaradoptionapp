const { supabase } = require('../config/config');

const addPet = async (pet) => {
  const { data, error } = await supabase
    .from('pets')
    .insert([pet]);

  if (error) {
    throw error;
  }

  return data;
};

const getPetById = async (id) => {
  const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();

  if (error) {
      throw error;
  }

  return data;
};

const getAllPets = async () => {
  const { data, error } = await supabase
      .from('pets')
      .select('*');

  if (error) {
      throw error;
  }

  return data;
};

module.exports = {
  addPet,
  getPetById,
  getAllPets
};