import nodemailer from "nodemailer";

const sendEmail = async (email, message) => {
  const mailConfig = {
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: process.env.NODE_PUBLIC_SENDINBLUE_USER,
      pass: process.env.NODE_PUBLIC_SENDINBLUE_KEY,
    },
  };
  const transporter = nodemailer.createTransport(mailConfig);
  const mailData = {
    from: '"Authenticator 🔒" <authenticator@unistack.ai>',
    to: email,
    subject: "Login credentials",
    html: message,
  };
  transporter.sendMail(mailData, (err, info) => {
    if (err) {
      console.error(err);
      return {
        error: {
          message: `Error sending email: ${err}`,
        },
      };
    }
    return {
      status: 200,
      message: `Email sent: ${info.response}`,
    };
  });
};

export default sendEmail;
