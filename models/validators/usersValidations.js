//Validations for users's userName property
const userNameValidations = [
  {
    validator: (name) => name !== '',
    message: 'Debe contener user de usuario',
  },
  {
    validator: (name) => name.length >= 6,
    message: 'El user de usuario debe ser >= a 6 caracteres',
  },
];

//Validations for user's email property
const emailValidations = [
  {
    validator: (email) => email !== '',
    message: 'Debe contener email',
  },
  {
    validator: (email) => {
      let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      return emailRegex.test(email);
    },
    message: 'El formato del correo no es válido',
  },
];

//Validations for users' password property
const passwordValidations = [
  {
    validator: (password) => password !== '',
    message: 'Debe contener password',
  },
  {
    validator: (password) => password.length >= 8,
    message: 'El password debe ser >= 8 caracteres',
  },
];

module.exports = {
  userNameValidations,
  emailValidations,
  passwordValidations,
};
