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
};
