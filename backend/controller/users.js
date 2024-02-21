const dao = require('../dao/users')



// Function responsible of obtaining all of the users in databse. Currently used as an example.
const getAllUsers = async () => {
   results= await dao.getUsers()

   return results
}

// Function responsible of calling the query that will add users to the database and it will also manage the result
const signup = async (credentials) => {

    result = await dao.addNewUser(credentials)

    if(result.user_id){

        return "User created Succesfully"
    }

    else{
        return "Failure to create user"
    }

}

module.exports={
    getAllUsers,
    signup
}