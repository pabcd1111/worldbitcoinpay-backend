const nodemailer = require("nodemailer");

module.exports = function SendEmailImage(head, body, emailAddress, attachment, attachType) {
    const transporter = nodemailer.createTransport({
        host: "smtpout.secureserver.net",
        port: 465,
        secure: true,
        auth: {
            user: process.env.OEMAIL,
            pass: process.env.OPASS,
        }
    });

    const options = {
        from: `World Bitcoin Pay ${process.env.EMAIL}`,
        to: emailAddress,
        subject: "Account Status",
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
        <img src="cid:logo" alt="logo" style="width: 20%" />
          <div style="border-bottom:1px solid #eee">
            <p>${body}</p>
          ${attachType === 'withdraw' ? `<img src="cid:withdraw" alt="withdraw" style="width: 100%" />` : `<img src="cid:activate" alt="activate" style="width: 100%" />`}
          <p style="font-size:0.9em;">Regards,<br />Worldbitcoinpay Team<br />Copyright 2022-Worldbitcoinpay-All rights reserved.</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
       
          </div>
        </div>
      </div>`,
      attachments: attachment
    };

    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Sent: " + info.response);
    })
}