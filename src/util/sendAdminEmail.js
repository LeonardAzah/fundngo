const sendEmail = require("./sendEmail");
const verifyEmail = require("../templates/mailTemplate");
const getFirstName = require("./getFirstName");

const sendAdminEmail = async ({ name, email, otp }) => {
  const message = "Your account has been created at FundNgo  log in with";
  name = getFirstName(name);

  const emailTemplate = verifyEmail(otp, name, message);

  await sendEmail({
    to: email,
    subject: "FundNgo email confirmation",
    html: emailTemplate.html,
  });
};

module.exports = sendAdminEmail;
