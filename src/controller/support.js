import nodemailer from "nodemailer";
import Admin from "../model/admin.js";

async function support(req, res) {
  const data = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "drkvoid7@gmail.com", // your email here
      pass: "czmagbsvwqjxjwlc", // app password here
    },
  });

  async function main() {
    const ad = await Admin.findOne()
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: "OG Network Support <drkvoid7@gmail.com>", // sender address
      to:ad.mail, // list of receivers
      subject: `Support Mail from ${ad.website_link}`, // Subject line
      html: `<pre>${JSON.stringify(data, null, 2)}</pre>`, // Converts data to a string and formats as HTML
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }

  main().catch(console.error);
  res.render("mail-sent");
}

export default support;
