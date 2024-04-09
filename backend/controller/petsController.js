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


module.exports = {
  petRegistration
};
