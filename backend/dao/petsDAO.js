// petsDAO.js
const db = require('../config/pg_config');

const getPets = async () => {
    const res = await pool.query('SELECT * FROM pets');
    return res.rows;
};

const getPetById = async (id) => {
    const res = await pool.query('SELECT * FROM pets WHERE id = $1', [id]);
    return res.rows[0];
};

module.exports = {
    getPets,
    getPetById,
};