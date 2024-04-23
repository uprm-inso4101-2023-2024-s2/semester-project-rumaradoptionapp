const dao = require('../dao/AdoptionForm')






const FillForm = async (form_Data,id_Data) =>{


    form_id = await dao.Form_Query(id_Data)

    result = await dao.AddNewForm(form_Data,form_id)

    if(result){
        console.log('Success')
        return "Form submitted successfully"
    }else{
        console.log("Failure")
        return "Error submitting form"
    }







}



module.exports={

    FillForm
}