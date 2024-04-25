const dao = require('../dao/AdoptionForm')






const FillForm = async (request) =>{


    form_id = await dao.Form_Query(request)

    result = await dao.AddNewForm(request.body,form_id)
    request.session.pet_id = null
    if(result){
        return "Form submitted successfully"
    }else{
        return "Error submitting form"
    }







}



module.exports={

    FillForm
}