// petsController.js
const express = require('express');
const router = express.Router();
const petsDAO = require('../dao/petsDAO');

router.get('/', async (req, res) => {
    const pets = await petsDAO.getPets();
    res.json(pets);
});

router.get('/:id', async (req, res) => {
    const pet = await petsDAO.getPetById(req.params.id);
    res.json(pet);
});

module.exports = router;