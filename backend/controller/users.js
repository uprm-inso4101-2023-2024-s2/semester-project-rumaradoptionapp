const dao = require('../dao/users')
const argon2 = require('argon2')
const { generateTemporaryPassword } = require('../dao/users');
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

const getUsers = async () => {
    users = await dao.getUserInfo()
    return users
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
                request.session.faculty = result.faculty
                request.session.foster = result.foster
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
const sendTemporaryPasswordEmail = async (email, temporaryPassword) => {
    try {
        await sendEmail(email, `Your temporary password is: ${temporaryPassword}. Please use this password to log in and reset your password.`);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
};

const verifyTemporaryPassword = async (email, temporaryPassword) => {
    try {
        const result = await dao.verifyTemporaryPassword(email, temporaryPassword);
        return result;
    } catch (error) {
        console.error('Error verifying temporary password:', error);
        return false;
    }
};

const forgotPassword = async (email) => {
    try {
        // Generate a temporary password
        const temporaryPassword = await generateTemporaryPassword(email);

        // Send the temporary password to the user's email
        await sendTemporaryPasswordEmail(email, temporaryPassword);

        return "Password reset email sent successfully.";
    } catch (error) {
        console.error('Error initiating password reset:', error);
        throw error;
    }
};

const resetPassword = async (email, newPassword) => {
    try {
        // Call your data access layer function to update the password
        const result = await dao.updatePasswordByEmail(email, newPassword);

        // Check if the password update was successful
        if (result) {
            return "Reset Password Success";
        } else {
            return "Error resetting password. Please try again."; // Return an error message if the update failed
        }
    } catch (error) {
        console.error('Error resetting password:', error);
        throw new Error('An error occurred while resetting the password');
    }
};

const updateFaculty = async (request) => {
    for (let i=0; i < request.length; i++) {
        await dao.updateFacultyStatus(request[i]);
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
    getUsers,
    getFaculty,
    updateFaculty,
    getFaculty,
    setprofilepicture,
    getProfilePicture,
    sendTemporaryPasswordEmail,
    forgotPassword,
    verifyTemporaryPassword,
    resetPassword
}