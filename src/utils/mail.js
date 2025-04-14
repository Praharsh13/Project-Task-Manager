import nodemailer from "nodemailer"
import Mailgen from "mailgen"


//Using nodemailer send mail and Mailegen

const sendEmail=async (options)=>{
    const mailGenerator=new Mailgen({
        theme:"default",
        product:{
            name:"Task Manager",
            link:"https://taskmanager.app"
        }
    })


    const emailTextual=mailGenerator.generatePlaintext(options.mailgenContext)
    const emailHtml=mailGenerator.generate(options.mailgenContext)


    const transporter=nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        service:process.env.SMTP_SERVICE,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD

        }

    })

    const mail={
        from:process.env.SMTP_MAIL,
        to:options.email,
        subject:options.subject,
        text:emailTextual,
        html:emailHtml
    }

    try{
        await transporter.sendMail(mail)
    }catch(error){
        console.error("Email service failed",error)
    }
}

//Make factory functions that return object
const emailVerificationMailContent=(username,verificationUrl)=>{
    return{
        body:{
            name:username,
            intro:"Welcome to our app! We are very excited to have you onboard",
            action:{
                instruction:"To verify please click on this button:",
                button:{
                    color: "#22BC66", // Optional action button color
                    text: "Verify your email",
                    link: verificationUrl,
                }
            },
            outro:
        "Need help, or have questions? Just reply to this email, we'd love to help."
        }
    }
}

const forgotpasswordMailContent=(username,passwordResetUrl)=>{
    return{
        body:{
            name:username,
            intro:"We got your request",
            action:{
                instruction:"To reset please click on this button:",
                button:{
                    color: "#22BC66", // Optional action button color
                    text: "Verify your email",
                    link: passwordResetUrl,
                }
            },
            outro:
        "Need help, or have questions? Just reply to this email, we'd love to help."
        }
    }
}


export {emailVerificationMailContent,forgotpasswordMailContent,sendEmail}