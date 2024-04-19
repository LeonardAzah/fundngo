const getFirstName = (name) => {
  const nameParts = name.trim().split(" ");
  if (nameParts.length > 1) {
    return nameParts[0];
  } else {
    return name;
  }
};
module.exports = getFirstName;
