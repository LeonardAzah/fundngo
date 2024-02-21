const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const organisationSchema = new Schema({
  organizationName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  cac: {
    type: String,
    required: true,
  },
  areaOfIntreat: {
    type: [{ type: String, required: true }],
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  otp: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  passwordTokenExpirationDate: {
    type: Date,
  },
  verified: Date,
  organisation: organisationSchema,
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
