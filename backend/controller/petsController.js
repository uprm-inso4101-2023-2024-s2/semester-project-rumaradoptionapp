const petsDao = require('../dao/Pets');

const petRegistration = async (req, res) => {
  try {
    const pet = req.body;
    const data = await petsDao.addPet(pet);
    res.json(data); // Send back the registered pet details
  } catch (error) {
    res.status(500).json({ error: error.message }); // Send an error message
  }
};


module.exports = {
  petRegistration
};
