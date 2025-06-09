
import { createTransport } from "nodemailer";

export function sendEmail(verifyCode, email) {
    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: "test011524@gmail.com",
            pass: "rbmfawkhxwjrrfle",
        },
    });
    async function main() {
        const info = await transporter.sendMail({
            from: '"Account verify" <test011524@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Welcome", // Subject line
            text: `Your verify code is ${verifyCode} `, // plain text body
            html: ``, // html body
        });
        console.log("Message sent: %s", info.messageId);
    }

    main().catch(console.error);
}