const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({

    service : 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'rumarapp@gmail.com',
        
        pass: 'czmdnldqyyfxlvtd'
    }

})

const sendEmail = async (email) => {


    const mailOptions = {

        from: 'rumarapp@gmail.com',
        to: email,
        subject: 'Email Verification',
        text: "This is a Test"
    }


    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    }); 
}

module.exports = {
    sendEmail
}
