const dao = require('../dao/users')
const argon2 = require('argon2')
const { sendEmail } = require('../../sendEmail'); // Import the sendEmail function

// Function responsible of obtaining all of the users in databse. Currently used as an example.
const getAllUsers = async () => {
   results= await dao.getUsers()

   return results
}

// Function responsible of calling the query that will add users to the database and it will also manage the result
const signup = async (credentials) => {

    emailCheck= await dao.checkEmail(credentials)
    usernameCheck = await dao.checkUsername(credentials)

    if (!emailCheck && !usernameCheck){
       
        result = await dao.addNewUser(credentials)

    if(result.user_id){

        token = await dao.getToken(result)
        await sendEmail(credentials.email,token.token);
        return "User created Succesfully, Please Confirm Email"
    }

    else{
        return "Failure to create user"
    }

    }
    
    else if(!usernameCheck && emailCheck){

        return ("The email already exist")
    }

    else if(!emailCheck && usernameCheck){
        return "The username already exist"
    }

    else{
        return "The username and email already exist"
    }

}

// Function responsible of calling the query that will check that the user has a valid password and username and it will also manage the result
const login = async (user_info) =>{

    const unhashed_password = user_info.password
    result = await dao.login(user_info)
    emailVerified = await dao.getVerified(user_info)
    console.log(emailVerified.verified)
    
    if(result){

        if(!emailVerified.verified){
            return JSON.stringify("Email not verified")
        }else{
            if(await argon2.verify(result.password, unhashed_password)){

            return JSON.stringify("Success")

        }else{

            return JSON.stringify("Failure wrong password")

        }
        }   

        
    }else{
        return JSON.stringify("Failure wrong username")
    }
}

module.exports={
    getAllUsers,
    signup,
    login
}