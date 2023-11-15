import { SentMessageInfo, createTransport } from "nodemailer";
import { Transporter } from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import SMTPTransport = require("nodemailer/lib/smtp-transport");

export class EmailService {

    private transporter : Transporter<SMTPTransport.SentMessageInfo>;

    createTransporter(transporter: SMTPTransport) {
        this.transporter = createTransport(transporter);
        return this;
    }

    async sendMailAsync(mail: MailOptions, callback :(err: Error, info: SentMessageInfo) => any) {
        return new Promise((res, rej) => {
            this.transporter.sendMail(mail, (err, info) => {
                if (err) {
                    callback(err, null)
                } else callback(null, info);
                res(void 0);
            });

        })
    }

    close() {
        this.transporter.close();
    }

}