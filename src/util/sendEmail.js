const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailerConfig");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport(nodemailerConfig);

  return transporter.sendMail({
    from: '"FundNgo" <fundngo@fundngo.com>',
    to: to,
    subject: subject,
    html: html,
  });
};

module.exports = sendEmail;
