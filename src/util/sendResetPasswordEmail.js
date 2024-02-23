const sendEmail = require("./sendEmail");
const verifyEmail = require("../templates/mailTemplate");
const getFirstName = require("./getFirstName");

const sendResetPasswordEmail = async ({ name, email, otp }) => {
  const message =
    "A request to change your fundngo account password was received.Use the code below to confirm  and proceed";
  name = getFirstName(name);

  const emailTemplate = verifyEmail(otp, name, message);

  await sendEmail({
    to: email,
    subject: "Reset fundngo password",
    html: emailTemplate.html,
  });
};

module.exports = sendResetPasswordEmail;
