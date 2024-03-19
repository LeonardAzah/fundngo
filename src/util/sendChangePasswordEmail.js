const sendEmail = require("./sendEmail");
const notificationEmail = require("../templates/mail");

const sendChangePasswordEmail = async ({ name, email }) => {
  const message = "Your account password has been change successfully";

  const emailTemplate = notificationEmail(name, message);

  await sendEmail({
    to: email,
    subject: "Password changed",
    html: emailTemplate.text,
  });
};

module.exports = sendChangePasswordEmail;
