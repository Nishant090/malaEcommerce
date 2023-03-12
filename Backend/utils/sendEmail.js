const nodeMailer=require("nodemailer")
const sendEmails=async(options)=>{
    const transporter=nodeMailer.createTransport({
        service:process.env.SMPT_SERVICE,
        secure:true,
        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASS
        },
    })

    const mailOptions={
        from:process.env.SMPT_MAIL,
        to:options.email, 
        subject:options.subject,
        text:options.message
     }
     
     await transporter.sendMail(mailOptions)
    
    
}
module.exports=sendEmails;