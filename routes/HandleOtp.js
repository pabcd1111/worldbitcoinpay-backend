const nodemailer = require("nodemailer");
var randomize = require("randomatic")

const mongoose = require("mongoose")
// Accepting{
//   email: email

// }





module.exports = async function HandleOtp(req, res) {

  const otp = randomize('0', 6);
  var today = new Date();
  var minutes = parseInt(today.getMinutes()) + 5; //OTP validation for 5 minutes
  var time = today.getHours() + ":" + minutes + ":" + today.getSeconds();

  const attachment = [{ filename: "logo.png", path:  __dirname+"/../public/images/logo.png", cid: 'logo' },]

  const timedOtp = {
    otp: otp,
    timeStamp: time
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    // secureConnection: false,
    // tls: {
    //     ciphers:'SSLv3',
    //     rejectUnauthorized: false 
    // },
    // requireTLS:true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    }
  });

  const options = {
    from: `World Bitcoin Pay ${process.env.EMAIL}`,
    to: `${req.body.email}`,
    subject: "Account Status",
    html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
        <img src="cid:logo" alt="logo" style="width: 20%" />
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Hi</a>
          </div>
          
          <p>Your Email One Time Password (OTP) to log in to your World Bitcoin Pay account is </p>
          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
          <p>The OTP is valid for 5 minutes.<br/> This OTP will be used to verify the device you are loggin in from. For account safety, do not share yout OTP with others.</p>
          <p style="font-size:0.9em;">Regards,<br />Team World Bitcoin Pay Security</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
       
          </div>
        </div>
      </div>`,
      attachments: attachment
  };



  const userExists = await mongoose.model("User").findOne({ email: req.body.email });
  if (userExists) {
    await mongoose.model("User").findOne({ email: req.body.email })
    .then(async (response)=>{
        await userExists.updateOne({ timedOtp: timedOtp })
        transporter.sendMail(options, (error, info) => {
          if (error) {
            console.log(error);
            return;
          }
          console.log("Sent: " + info.envelope);
        })
        res.status(200).json({userId: response.userId}) 
      
    }).catch(err=>{
      console.log(err);
    })
  }

}