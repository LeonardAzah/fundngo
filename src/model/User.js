const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ["admin", "donor", "ngo"],
    default: "donor",
  },
  accountType: {
    type: String,
    enum: ["individual", "corporation", "ngo"],
  },
  phone: {
    type: String,
    required: function () {
      return this.accountType === "ngo";
    },
  },

  cac: {
    type: String,
    required: function () {
      return this.accountType === "ngo";
    },
  },

  country: {
    type: String,
    required: function () {
      return this.accountType === "ngo";
    },
  },

  state: {
    type: String,
    required: function () {
      return this.accountType === "ngo";
    },
  },
  areaOfIntrest: {
    type: [String],
    required: function () {
      return this.accountType === "ngo";
    },
  },
  googleId: { type: String },
  photo: {
    type: String,
  },
  otp: String,
  passwordOtp: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isValidated: {
    type: Boolean,
    default: false,
  },
  passwordTokenExpirationDate: {
    type: Date,
  },
  verified: Date,
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
