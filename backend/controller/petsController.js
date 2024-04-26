const petsDao = require('../dao/Pets');
const petImageDao = require('../dao/Petimage'); 

const petRegistration = async (req, res) => {
  try {
    const pet = req.body;
    if (!pet.name || !pet.age || !pet.species || !pet.weight || !pet.size || !pet.personality || !pet.sex) {
      // If any fields are missing, do not register the pet
      res.redirect('/postPetRegistration?registered=false');
    } else {
      // If all fields are filled, register the pet
      const data = await petsDao.addPet(pet);
      res.redirect('/postPetRegistration?registered=true');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPetById = async (req, res) => {
  try {
    const petId = req.params.id;
    const pet = await petsDao.getPetById(petId);
    if (pet) {
      // Fetch the newest image for the pet
      const newestImage = await petImageDao.getNewestPetImage(pet.id);
      pet.image = newestImage; // Add the image to the pet object
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
    const pets = await petsDao.getAllPets();
    
    // Fetch the newest image for each pet
    for (let pet of pets) {
      const newestImage = await petImageDao.getNewestPetImage(pet.id);
      pet.image = newestImage; // If no images, this will be null or undefined
    }

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
