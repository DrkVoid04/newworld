import nodemailer from "nodemailer"

async function mail(req, res, next) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
          user: "drkvoid7@gmail.com",
          pass: "rcbjtyznpvdzmecb",
        },
      });
      async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: "drkvoid7@gmail.com", // sender address
          to: "drkvoid07@gmail.com", // list of receivers
          subject: "Buy request for product : " + req.query.product, // Subject line
          text: `Username: ${req.query.username}, Discord link : ${req.query.link}`, // plain text body
          html: `Username: ${req.query.username} <br>
                 Discord link : <a href="${req.query.link}">${req.query.link}</a> `
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
      }
      main().catch(console.error);
      next()
}
export default mail;