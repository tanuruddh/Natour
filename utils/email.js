import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
const sendEmail = async (options) => {

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    // const MailGenerator = new Mailgen({
    //     theme: "default",
    //     product: {
    //         name: "Test Email",
    //         link: 'https://mailgen.js/'
    //     }
    // })

    const mailOptions = {
        from: 'trp Singh <trpsingh1212@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html:
    }
    // console.log(mailOptions);

    await transporter.sendMail(mailOptions);

}

export default sendEmail;