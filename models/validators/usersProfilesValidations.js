//Validations for users's userName property
const profileNameValidations = [
  {
    validator: (name) => name !== '',
    message: 'Debe contener nombre',
  },
];

//Validations for user's email property
const phoneValidations = [
  {
    validator: (phone) => phone !== '',
    message: 'Debe contener teléfono',
  },
  {
    validator: (phone) => {
      let phoneRegex =
        /^(?:\([2-9]\d{2}\)\ ?|[2-9]\d{2}(?:\-?|\ ?))[2-9]\d{2}[- ]?\d{4}$/;
      return phoneRegex.test(phone);
    },
    message: 'El formato del teléfono no es válido',
  },
];

//Validations for profile's picture property
const userPictureValidations = [
  {
    validator: (userImage) => {
      if (userImage === '') return true;
      /^([A-Za-z0-9\-\/\_\.])+$/.test(userImage) === true;
    },
    message: 'El formato de la ruta de la imagen no es correct',
  },
];

//Validations for profile's url property
const urlValidations = [
  {
    validator: (url) => {
      if (url === '') return true;
      let urlRegex =
        /^((http:\/\/www\.)|(www\.)|(http:\/\/))[a-zA-Z0-9._-]+\.[a-zA-Z.]{2,5}$/;
      return urlRegex.test(url);
    },
    message: 'El formato del url no es válido',
  },
];

//Validations for profile's rating property
const ratingValidations = [
  {
    validator: (experience) => experience !== '',
    message: 'Debe contener experiencia',
  },
  {
    validator: (experience) => isNaN(experience) === false,
    message: 'Experiencia debe ser un número',
  },
  {
    validator: (experience) => experience >= 0 && experience < 11,
    message: 'Experiencia debe ser entre 0 y 10',
  },
];

module.exports = {
  profileNameValidations,
  phoneValidations,
  userPictureValidations,
  urlValidations,
  ratingValidations,
};
