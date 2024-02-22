const { pool } = require('../config/pg_config');

const getAllPets = async () => {
    try {
        const result = await pool.query('SELECT * FROM pets');
        return result.rows;
    } catch (error) {
        console.error('Error fetching pets:', error.message);
        throw error;
    }
};

module.exports = { getAllPets };
