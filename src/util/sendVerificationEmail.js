const sendEmail = require("./sendEmail");
const verifyEmail = require("../templates/mailTemplate");

const sendVerificationEmail = async ({ name, email, otp }) => {
  const message =
    "A request to create your FundNgo account was received.Use the code below to confirm your account and log in";

  const emailTemplate = verifyEmail(otp, name, message);

  await sendEmail({
    to: email,
    subject: "FundNgo email confirmation",
    html: emailTemplate.html,
  });
};

module.exports = sendVerificationEmail;
