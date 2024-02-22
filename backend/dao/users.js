const {response} = require('express')


//Variable responsible of all of the database functions and connections
const db = require('../config/pg_config')


//Variable responsible of the hashing of the password. (argon2 is the hashing algorithm)
const argon2 = require('argon2')



//Query responsible of obtaining all users (Currently used as an example and it will obtain all of the usernames from the users)
const getUsers = async (request,response) => {
    
    const result= await db.pool.query("select username from users")

    return result.rows
}

//Query responsible of adding new users to our database. (Query used during signup)
const addNewUser = async (request,response) =>{

    //Here we will obtain all of the data in resquest.body (blank text boxes in the frontend)
    const {firstName,lastName,username,email,location,gender,foster} = request


    //argon2.hash() will be responsible of hashing the password. It only needs the original value as input and it will generate the hash. 
    const password = await argon2.hash(request.password)
    
    const result = await db.pool.query('insert into users (firstname,lastname,username,email,password,location,gender,foster) values ($1,$2,$3,$4,$5,$6,$7,$8) returning user_id',[firstName,lastName,username,email,password,location,gender,foster])


   return result.rows[0]


}


module.exports={
    getUsers,
    addNewUser
}
