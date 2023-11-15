import { Router } from "../core/router"
import { BaseResponse } from "../utils/Http";
import { EmailService } from "../services/email-service";

export const routerEmail = new Router(false, "email");
const emailService = new EmailService();

routerEmail.appendRoute("send", async (url, req) => {
    let body = await req.json();

    if (body.transporter) {
        emailService.createTransporter(body);
        let error: Error = null;

        if (body.mail) {
            await emailService.sendMailAsync(body.mail, (err, info) => {            
                
                if (info) {
                    console.log(info);
                }
                
                if (err) {
                    console.log(err);
                    error = err
                }
            })
        } else return new BaseResponse(400, {
            status: 400,
            message: "Mail not found. Its mandatory!"
        })

        if (error) {
            return new BaseResponse(500, error)
        }

        emailService.close();
    }
    
    return new BaseResponse(400, {
        status: 400,
        message: "Transporter not found. Its mandatory!"
    })
})
