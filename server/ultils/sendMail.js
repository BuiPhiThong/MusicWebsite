const nodemailter = require('nodemailer')
const asynHandler = require('express-async-handler')
const transporter = nodemailter.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure:false,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
})

const sendEmail = asynHandler(async ({email,html})=>{
    try {
     let info=   await transporter.sendMail({
            from:  '"Cuahangdientu" <no-relply@cuahangdientu.com>',
            to:email,
            subject:"Forgot Password",
            html:html
        })
     
        return info
    } catch (error) {
        console.error('Error sending email:', error);
    }
})

module.exports= {
    sendEmail
}