'use strict';

const mongoose = require('mongoose');
const cote = require('cote');

const thumbnailRequester = new cote.Requester(
  {
    name: 'thumbnail creator client',
  },
  { log: false, statusLogsEnabled: false }
);

const fsPromises = require('fs').promises;
const fs = require('fs-extra');
const path = require('path');

const {
  profileNameValidations,
  phoneValidations,
  userPictureValidations,
  ratingValidations,
  urlValidations,
} = require('./validators');

const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const userProfileSchema = Schema({
  userId: { type: ObjectId, required: true, unique: true, index: true },
  name: { type: String, required: true, validate: profileNameValidations },
  phone: { type: String, required: true, validate: phoneValidations },
  description: { type: String },
  url: { type: String, validate: urlValidations },
  userImage: { type: String, validate: userPictureValidations },
  rating: { type: Number, validate: ratingValidations },
  cv: { type: String }, //si da tiempo
});

userProfileSchema.set('timestamps', true);

userProfileSchema.methods.setPicture = async function ({
  path: imagePath,
  originalname: imageOriginalName,
}) {
  if (!imageOriginalName) return;
  const imagePublicPath = path.join(__dirname, '../uploads', imageOriginalName);
  await fs.copy(imagePath, imagePublicPath);

  this.userImage = imageOriginalName;
  // Create thumbnail
  thumbnailRequester.send({ type: 'createThumbnail', image: imagePublicPath });
};

var UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
