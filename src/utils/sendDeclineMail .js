const sendEmail = require("./sendEmail");
const notificationEmail = require("../templates/mail");

const sendDeclineEmail = async ({ name, email }) => {
  const message =
    "Sorry, your request to verify your FundNGO account has been declined.";

  const emailTemplate = notificationEmail(name, message);

  await sendEmail({
    to: email,
    subject: "NGO Account Verification",
    html: emailTemplate.html,
  });
};

module.exports = sendDeclineEmail;
