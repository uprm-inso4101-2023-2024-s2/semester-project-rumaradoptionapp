const {response} = require('express')
const randomT = require('random-token')


//Variable responsible of all of the database functions and connections
const db = require('../config/pg_config')


//Variable responsible of the hashing of the password. (argon2 is the hashing algorithm)
const argon2 = require('argon2')
const randomToken = require('random-token')



//Query responsible of obtaining all users (Currently used as an example and it will obtain all of the usernames from the users)
const getUsers = async (request,response) => {
    
    const result= await db.pool.query("select username from users")

    return result.rows
}

//Query responsible of adding new users to our database. (Query used during signup)
const addNewUser = async (request,response) =>{

    //Here we will obtain all of the data in resquest.body (blank text boxes in the frontend)
    const {firstname,lastname,username,email,location,gender,foster} = request

    const token = await randomT(10)
    console.log(token)
   

    //argon2.hash() will be responsible of hashing the password. It only needs the original value as input and it will generate the hash. 
    const password = await argon2.hash(request.password)
    
    const result = await db.pool.query('insert into users (firstname,lastname,username,email,password,location,gender,foster,token) values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning user_id',[firstname,lastname,username,email,password,location,gender,foster,token])


   return result.rows[0]


}
//Query responsible for getting the username password from the database
const login = async(request, response) =>{
    
    const username = request.username
    const result = await db.pool.query('select password from users where username = $1', [username])
    
    return result.rows[0]
}

const checkUsername = async(request,response) =>{

    const username = request.username
    const result = await db.pool.query('select username from users where username =$1', [username])
    return result.rows[0]
}

const checkEmail = async(request,response) =>{
    const email = request.email
    const result =await db.pool.query('select email from users where email = $1', [email])
    return result.rows[0]
}

const getToken = async(request,response) => {

    const user_id = request.user_id
    const result = await db.pool.query('select token from users where user_id = $1',[user_id])
    
    return result.rows[0]

}

module.exports={
    getUsers,
    addNewUser,
    login,
    checkUsername,
    checkEmail,
    getToken
}
