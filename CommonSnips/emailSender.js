const nodemailer = require('nodemailer');

// SMTP Setting
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'shivamkumar0170951@gmail.com',
        pass: 'tppzqdcpuidyeakd'
    },
})

const sendEmail = async (to,subject, text) => {
    const mailOptions = {
        from: 'shivamkumar0170951@gmail.com',
        to,
        subject,
        text
    }
    try {
        const info = await transporter.sendMail(mailOptions)
        console.log(info)
    } catch (error) {
        console.error(error);
    }
}

module.exports = {sendEmail};
