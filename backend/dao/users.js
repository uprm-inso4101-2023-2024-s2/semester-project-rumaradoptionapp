const {response} = require('express')
const randomT = require('random-token')
const fs = require('fs')


//Variable responsible of all of the database functions and connections
const db = require('../config/pg_config')


//Variable responsible of the hashing of the password. (argon2 is the hashing algorithm)
const argon2 = require('argon2')
const randomToken = require('random-token')
const { getprofilepicture } = require('../controller/users')



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
    const result = await db.pool.query('select password,user_id from users where username = $1', [username])
    
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

const getVerified = async(request,response) => {
    
    const username = request.username
    const result = await db.pool.query('select verified from users where username = $1',[username])

    return result.rows[0]
}

//Query responsible of obtaining all Fosters (name, email, location, and gender)
const getFoster = async (request,response) => {
    const foster = await db.pool.query("select firstname, lastname, email, location, gender from users where foster = true")

    return foster.rows
}

const verifyVerificationCode = async (request, response) => {
    const username = request.username;
    const result = await db.pool.query('SELECT token FROM users WHERE username = $1', [username]);
    const storedVerificationCode = result.rows[0];
    return storedVerificationCode;
};

const setVerifiedStatus = async (username) => {
    try {
        await db.pool.query('UPDATE users SET verified = true WHERE username = $1', [username]);
        return true;
    } catch (error) {
        console.error('Error setting verified status:', error);
        return false;
    }
};

const getFaculty = async (request,response) => {
    const faculty = await db.pool.query("select firstname, lastname, email, location, gender from users where faculty = true")
    return faculty.rows
}
const setProfilePictureQuery = async (request) => {
    const data = fs.readFileSync(request.file.path);    
    const imageBase64 = data.toString('base64');
    const user_id = request.session.user_id;
    const result = await db.pool.query("UPDATE users SET profile_picture = $1 WHERE user_id = $2 RETURNING profile_picture", [imageBase64, user_id])
    fs.unlink(request.file.path,(err) => {
        if (err) {
          console.error('Error deleting file:', err);
          // Handle the error appropriately, such as sending an error response
          // or taking other corrective actions.
        } else {
          console.log('File deleted successfully');
          // Continue with other operations if needed.
        }
      });
    return result.rows[0] 
}


const getProfilepictureQuery = async (request) => {
    const user_id = request.session.user_id;
    const result = await db.pool.query("select profile_picture from users where user_id = $1",[user_id]);
    return result.rows[0].profile_picture
}



module.exports={
    getUsers,
    addNewUser,
    login,
    checkUsername,
    checkEmail,
    getToken,
    getVerified,
    getFoster,
    verifyVerificationCode,
    setVerifiedStatus,
    getFaculty,
    setProfilePictureQuery,
    getProfilepictureQuery
}
