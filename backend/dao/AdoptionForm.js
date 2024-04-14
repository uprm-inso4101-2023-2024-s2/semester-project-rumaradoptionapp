//Variable responsible of all of the database functions and connections
const { request } = require('express')
const db = require('../config/pg_config')







const Form_Query = async (request,response) =>{

    const user_id = request.user_id
    const pet_id = request.id


    const result = await db.pool.query("insert into forms (user_id,pet_id) values ($1,$2) returning f_id",[user_id,pet_id])


    return result.rows[0]


}


module.exports={
    Form_Query
}