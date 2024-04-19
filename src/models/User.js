const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
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
    documents: {
      type: [String],
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
    status: {
      type: String,
      enum: ["waiting", "pending", "approved"],
      default: "waiting",
      required: function () {
        return this.accountType === "ngo";
      },
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
    verified: Date,
    portfolio: {
      type: mongoose.Types.ObjectId,
      ref: "Portfolio",
    },
    payment: {
      type: mongoose.Types.ObjectId,
      ref: "Payment",
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre(
  "save",
  async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
