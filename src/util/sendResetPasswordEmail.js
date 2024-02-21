const sendEmail = require("./sendEmail");
const verifyEmail = require("../templates/mailTemplate");

const sendResetPasswordEmail = async ({ name, email, otp }) => {
  const message =
    "A request to change your fundngo account password was received.Use the code below to confirm  and proceed";

  const emailTemplate = verifyEmail(otp, name, message);

  await sendEmail({
    to: email,
    subject: "Reset fundngo password",
    html: emailTemplate.html,
  });
};

module.exports = sendResetPasswordEmail;
