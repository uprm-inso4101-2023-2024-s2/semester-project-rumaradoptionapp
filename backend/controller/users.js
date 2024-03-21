const dao = require('../dao/users')
const argon2 = require('argon2')
const { sendEmail } = require('../../sendEmail'); // Import the sendEmail function

// Function responsible of obtaining all of the users in databse. Currently used as an example.
const getAllUsers = async () => {
   results= await dao.getUsers()

   return results
}

const getFaculty = async () => {
    faculty = await dao.getFaculty()
    return faculty
};

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
    
    //console.log(emailVerified.verified)
    
    if(result){

        
        if(await argon2.verify(result.password, unhashed_password)){

            emailVerified = await dao.getVerified(user_info)

            if(!emailVerified.verified){
                return ("Email not verified")
            }
            
            else{

            return ("Success")

            }
            

        }else{
            
            return ("Wrong username or password")

        }
          

        
    }else{
        return ("Wrong username or password")
    }
}
const verifyVerificationCode = async (formData) => {

    const storedVerificationCode = await dao.verifyVerificationCode(formData);
    
    if (storedVerificationCode) {
    
        if (formData.token === storedVerificationCode.token) {
            if (await dao.setVerifiedStatus(formData.username)) {
                return "Verification successful";
            } else {
                return "Failure to update verified status";
            }
        } else {
            return "Failure wrong verification code";
        }
    } else {
        return "Failure wrong username";
    }
}


module.exports={
    getAllUsers,
    signup,
    login,
    verifyVerificationCode,
    getFaculty
}