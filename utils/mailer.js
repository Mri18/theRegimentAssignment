const nodeMailer = require('nodemailer');
require('dotenv').config();
const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
console.log('Transporter auth:', transporter.auth); 

const sendEmail = async (toOrOptions, subject, text) => {
  let to = toOrOptions;
  // support calling with a single object: { to, subject, text }
  if (typeof toOrOptions === 'object' && toOrOptions !== null && !Array.isArray(toOrOptions)) {
    to = toOrOptions.to;
    subject = toOrOptions.subject;
    text = toOrOptions.text;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

module.exports = sendEmail;