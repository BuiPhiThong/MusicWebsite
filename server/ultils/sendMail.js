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

const sendEmail = asynHandler(async ({email,html,subject})=>{
    try {
     let info=  await transporter.sendMail({
            from:  '"T-GT ENTERTAIRMENT" <no-relply@bpt.com>',
            to:email,
            subject:subject,
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