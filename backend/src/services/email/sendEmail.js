import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",//Sends mail from Gmail muabdulrehman58@gmail.com

    auth: {// to authenticate the email account that will be used to send emails
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendEmail = async ({
    to,
    subject,
    html }) => {

    await transporter.sendMail({
        from: `"Abdul's Blogging Application" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    });

};