const {response} = require('express')

const db = require('../config/pg_config')
//import pool from '../config/pg_config'
//Query responsible of obtaining all users

const getUsers = async (request,response) => {
    
    const result= await db.pool.query("select username from users")

    return result.rows
}


module.exports={
    getUsers
}
