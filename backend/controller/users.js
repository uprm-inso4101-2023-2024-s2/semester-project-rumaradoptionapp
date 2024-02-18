const test = require('../dao/users')




const getAllUsers = async () => {
   results= await test.getUsers()

   return results
}



module.exports={
    getAllUsers
}