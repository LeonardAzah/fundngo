const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({ name, email, otp }) => {
  const message =
    "A request to create your iVote account was received.Use the code below to confirm your account and log in";

  const emailTemplate = verifyEmail(otp, name, message);

  await sendEmail({
    to: email,
    subject: "iVote email confirmation",
    html: emailTemplate.html,
  });
};

module.exports = sendVerificationEmail;
