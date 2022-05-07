"use strict";

const mongoose = require("mongoose");
var hash = require("hash.js");

// const {
//   userNameValidations,
//   emailValidations,
//   passwordValidations,
// } = require('./validators');

const Schema = mongoose.Schema;

const userSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    // validate: emailValidations,
  },
  password: {
    type: String,
    required: true /* , validate: passwordValidations */,
  },
});

userSchema.statics.hashPassword = function (plain) {
  return hash.sha256().update(plain).digest("hex");
};

userSchema.set("timestamps", true);

var User = mongoose.model("User", userSchema);

module.exports = User;
