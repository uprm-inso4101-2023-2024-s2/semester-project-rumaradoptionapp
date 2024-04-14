const dao = require('../dao/AdoptionForm')






const FillForm = async (form_Data,id_Data) =>{


    form_id = await dao.Form_Query(id_Data)

    if(form_id){

        console.log("Success")
    }
    else{

        console.log("Fail")
    }







}



module.exports={

    FillForm
}