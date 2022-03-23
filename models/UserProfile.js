'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const userProfileSchema = Schema({
  userId: { type: ObjectId, required: true, unique: true, index: true },
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  description: { type: String, required: true },
  url: { type: String },
  userImage: { type: File },
  rating: { type: Number },
  cv: { type: String }, //si da tiempo
});

userProfileSchema.set('timestamps', true);

var UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
