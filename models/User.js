'use strict';

const mongoose = require('mongoose');
var hash = require('hash.js');

// const {
//   userNameValidations,
//   emailValidations,
//   passwordValidations,
// } = require('./validators');

const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const userSchema = Schema({
  // userName: {
  //   type: String,
  //   required: false,
  //   unique: false,
  //   index: true,
  //   // validate: userNameValidations,
  // },

  // _id: ObjectId,

  email: {
    type: String,
    required: true,
    unique: true,
    // validate: emailValidations,
  },
  password: { type: String, required: true  /* , validate: passwordValidations */ }
  
  // ,
  // favorites: { type: [ObjectId] },

});

userSchema.statics.hashPassword = function (plain) {
  return hash.sha256().update(plain).digest('hex');
};

userSchema.set('timestamps', true);

var User = mongoose.model('User', userSchema);

module.exports = User;
