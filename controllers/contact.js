const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const mailtransporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  })
);

const handleContact = (req, res, db) => {
  const { name, email, account, details } = req.body;
  try {
    const mailOptions1 = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Automatic Message: Email Received",
      text: `Hi ${name}, this is just to let you know we have received your message. We will be in contact as soon as possible.`
    };
    const mailOptions2 = {
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      subject: "Email Received",
      text: `Name: ${name} | Account: ${account} | Email: ${email} | Details: ${details}`
    };
    mailtransporter.sendMail(mailOptions1, (error, info) => {
      if (error) {
        return res.status(400).json("error");
      }
      mailtransporter.sendMail(mailOptions2, (error, info) => {
        if (error) {
          return res.status(400).json("error");
        } else {
          return res.status(200).json("sent");
        }
      });
    });
  } catch (err) {
    return res.status(400).json("error");
  }
};

module.exports = {
  handleContact
};
