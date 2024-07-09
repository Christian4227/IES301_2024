import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.TEP_EMAIL_ACCOUNT,
        pass: process.env.TEP_EMAIL_PWD,
    },
});
export default transporter;