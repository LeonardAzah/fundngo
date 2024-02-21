const bcrypt = require("bcryptjs");

const createHash = async (data) => {
  const salt = await bcrypt.genSalt(10);
  const hashedData = await bcrypt.hash(data, salt);
  return hashedData;
};

module.exports = createHash;
