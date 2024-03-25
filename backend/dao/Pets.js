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

module.exports = {
  addPet
};
