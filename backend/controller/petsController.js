const petsDao = require('../dao/Pets');

const petRegistration = async (req, res) => {
  try {
    const pet = req.body;
    if (!pet.name || !pet.age || !pet.species || !pet.weight || !pet.size || !pet.personality || !pet.sex) {
        // If any or all fields are missing, do not register the pet
        res.redirect('/postPetRegistration?registered=false');
    } else {
        // If all fields on the perRegistration form are filled, register the pet
        const data = await petsDao.addPet(pet);
        res.redirect('/postPetRegistration?registered=true');
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // Send an error message
  }
};

const getPetById = async (req, res) => {
  try {
      const petId = req.params.id;
      const pet = await petsDao.getPetById(petId);
      if (pet) {
        req.session.pet_id= petId
        res.render('petProfile', { pet });
      } else {
          res.status(404).send('Pet not found');
      }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const getAllPets = async (req, res) => {
  try {
      req.session.pet_id=null
      const pets = await petsDao.getAllPets();
      res.render('petListings', { pets });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

module.exports = {
  petRegistration,
  getPetById,
  getAllPets
};
