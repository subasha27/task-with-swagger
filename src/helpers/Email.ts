import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config();

const sendEmail = async(mail :string,subject:string,text:string)=>{
        const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.user,
        pass: process.env.pass
        },
        });
        await transporter.sendMail({
            from: process.env.user,
            to: mail,
            subject: subject,
            text: text,
        });
        console.log("email sent sucessfully");
}

export default sendEmail;