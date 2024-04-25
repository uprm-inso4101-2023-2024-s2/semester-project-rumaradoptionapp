//Variable responsible of all of the database functions and connections
const { request } = require('express')
const db = require('../config/pg_config')







const Form_Query = async (request,response) =>{

    const user_id = request.session.user_id
    const pet_id = request.session.pet_id


    const result = await db.pool.query("insert into forms (user_id,pet_id) values ($1,$2) returning f_id",[user_id,pet_id])


    return result.rows[0].f_id


}
const AddNewForm = async(request, f_id,response) =>{
    
    const {address, housing_type, people_house, num_pets, type_pets, adoption_reason, neighborhood_description, pet_location} = request
    const result = await db.pool.query("insert into form_details (f_id, address, housing_type, people_house, num_pets, type_pets, adoption_reason, neighborhood_description, pet_location) values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning details_id",[f_id, address, housing_type, people_house, num_pets, type_pets, adoption_reason, neighborhood_description, pet_location])
    return result.rows[0].details_id

}

module.exports={
    Form_Query,
    AddNewForm
}