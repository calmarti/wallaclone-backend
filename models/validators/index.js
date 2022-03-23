const {
  nameValidations,
  priceValidations,
  pictureValidations,
  tagsValidations,
  descriptionValidations,
  experienceValidations,
  paymentMethodsValidations,
} = require('./advertsValidations');

const {
  userNameValidations,
  emailValidations,
  passwordValidations,
} = require('./usersValidations');

const {
  profileNameValidations,
  phoneValidations,
  userPictureValidations,
  ratingValidations,
  urlValidations,
} = require('./usersProfilesValidations');

module.exports = {
  nameValidations,
  priceValidations,
  pictureValidations,
  tagsValidations,
  descriptionValidations,
  experienceValidations,
  paymentMethodsValidations,
  userNameValidations,
  emailValidations,
  passwordValidations,
  profileNameValidations,
  phoneValidations,
  userPictureValidations,
  ratingValidations,
  urlValidations,
};
