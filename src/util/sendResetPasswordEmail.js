const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async ({ name, email, otp }) => {
  const message =
    "A request to change your iVote account password was received.Use the code below to confirm your account and log in";

  const emailTemplate = verifyEmail(otp, name, message);

  await sendEmail({
    to: email,
    subject: "Reset iVote password",
    html: emailTemplate.html,
  });
};

module.exports = sendResetPasswordEmail;
