const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const crypto = require("crypto");

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

const handleForgotPassword = async (req, res, db, bcrypt) => {
  const { account, email } = req.body;
  try {
    const code = crypto.randomBytes(15).toString("hex");
    const forgotcode = bcrypt.hashSync(code);
    const response = await db.transaction(trx => {
      return trx
        .from(`${account.toLowerCase()}_users`)
        .where({ email })
        .update({ forgotcode });
    });
    if (!response) {
      return res.status(400).json("does not exist");
    }
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Did you forget your password?",
      text: `We recently received a request to reset your password. Your reset code is: ${code}`
    };
    mailtransporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(400).json("error");
      }
      return res.status(200).json("complete");
    });
  } catch (err) {
    return res.status(400).json("does not exist");
  }
};

const handleForgotPasswordCodeSubmit = async (req, res, db, bcrypt) => {
  const { code, newpassword, account, email } = req.body;
  if (!code || !account || !email) {
    return res.status(400).json("incorrect form submission");
  }
  try {
    const data = await db
      .select("forgotcode")
      .from(`${account.toLowerCase()}_users`)
      .where({ email });
    const isValid = bcrypt.compareSync(code, data[0].forgotcode);
    if (isValid) {
      if (!newpassword) {
        return res.status(200).json("match");
      }
      hash = bcrypt.hashSync(newpassword);
      const response = await db.transaction(trx => {
        return trx
          .from(`${account.toLowerCase()}_users`)
          .where({ email })
          .update({ hash });
      });
      return res.status(200).json("changed");
    }
    return res.status(400).json("no match");
  } catch (err) {
    return res.status(400).json("error");
  }
};

module.exports = {
  handleForgotPassword,
  handleForgotPasswordCodeSubmit
};
