const sendEmail = require("./sendEmail");
const notificationEmail = require("../templates/mail");

const sendApproveEmail = async ({ name, email }) => {
  const message =
    " Congratulations, your Fundngo account has been successfully verified.";

  const emailTemplate = notificationEmail(name, message);

  await sendEmail({
    to: email,
    subject: "NGO Account Verification",
    html: emailTemplate.html,
  });
};

module.exports = sendApproveEmail;
