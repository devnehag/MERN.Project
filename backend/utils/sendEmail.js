const nodeMailer = require("nodemailer");

const sendEmail = async (options)=>{
    const transporter =nodeMailer.createTransport({
        host:process.env.SMPT_HOST,
        port:process.env.SMPT_PORT,
        service:process.env.SMPT_SERVICE,
        secure: false, //added for yahoo
        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD
        },
        //debug: false,//Added for yahoo only
        logger: true //Added for yahoo only

    })
    const mailOptions = {
        from:process.env.SMPT_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message,
    };
    await transporter.sendMail(mailOptions)
};

module.exports = sendEmail;