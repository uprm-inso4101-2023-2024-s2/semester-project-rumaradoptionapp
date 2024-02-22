// pets.js

const petsDao = require('../dao/pets');

const getAllPets = async () => {
    try {
        const pets = await petsDao.getAllPets();
        return pets;
    } catch (error) {
        console.error('Error fetching pets:', error.message);
        throw error;
    }
};

module.exports = { getAllPets };
