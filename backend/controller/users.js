const dao = require('../dao/users')
const argon2 = require('argon2')
const { sendEmail } = require('../../sendEmail'); // Import the sendEmail function

// Function responsible of obtaining all of the users in databse. Currently used as an example.
const getAllUsers = async () => {
   results= await dao.getUsers()

   return results
}

// Function responsible of obtaining all Fosters in the database
const getFoster = async () => {
    foster = await dao.getFoster()

    return foster
};

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
const login = async (request) =>{

    const unhashed_password = request.body.password
    result = await dao.login(request.body)
    
    //console.log(emailVerified.verified)
    
    if(result.password){

        
        if(await argon2.verify(result.password, unhashed_password)){

            emailVerified = await dao.getVerified(request.body)

            if(!emailVerified.verified){
                return ("Email not verified")
            }
            
            else{
                request.session.user_id = result.user_id
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
const setprofilepicture = async (request) => {
    const result = await dao.setProfilePictureQuery(request);
    if(result){
        console.log("We dit it!!!!");
    }else{
        console.log("womp womp");
    }

}

const getProfilePicture = async (request) => {
    const result = await dao.getProfilepictureQuery(request);

    const picture ="data:image/png;base64," + result;

    return picture;

}
module.exports={
    getAllUsers,
    signup,
    login,
    getFoster,
    verifyVerificationCode,
    getFaculty,
    setprofilepicture,
    getProfilePicture
}