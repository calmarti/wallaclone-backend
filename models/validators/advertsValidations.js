//Validations for advert's name property
const nameValidations = [
  {
    validator: (name) => name !== '',
    message: 'Debe contener nombre',
  },
];

//Validations for advert's description property
const descriptionValidations = [
  {
    validator: (description) => description !== '',
    message: 'Debe contener descripción',
  },
];

//Validations for advert's price property
const priceValidations = [
  {
    validator: (price) => price > 0,
    message: 'Precio debe ser mayor que 0',
  },
  {
    validator: (price) => isNaN(price) === false,
    message: 'Precio debe ser un número',
  },
];

//Validations for advert's picture property
const pictureValidations = [
  {
    validator: (advertImage) => advertImage.length > 0,
    message: 'Debe contener una imagen',
  },
  {
    validator: (advertImage) =>
      /^([A-Za-z0-9\-\/\_\.])+$/.test(advertImage) === true,
    message: 'El formato de la ruta de la imagen no es correct',
  },
];

//Validations for advert's tags property
const tagsValidations = [
  {
    validator: (tags) => tags.length > 0 && tags.length < 5,
    message: 'Los anuncios deben tener entre 1-4 etiquetas',
  },
  {
    validator: (tag) => tag.every((t) => t !== ''),
    message: 'Las etiquetas no pueden estar en blanco',
  },
];

//Validations for advert's experience property
// const experienceValidations = [
//   {
//     validator: (experience) => experience !== '',
//     message: 'Debe contener experiencia',
//   },
//   {
//     validator: (experience) => isNaN(experience) === false,
//     message: 'Experiencia debe ser un número',
//   },
//   {
//     validator: (experience) => experience > 0 && experience < 11,
//     message: 'Experiencia debe ser entre 1 y 10',
//   },
// ];

//Validations for advert's experience property
const paymentMethodsValidations = [
  {
    validator: (paymentMethods) => paymentMethods.length > 0,
    message: 'Los anuncios deben tener por lo menos 1 método de pago.',
  },
  {
    validator: (paymentMethods) => paymentMethods.every((t) => t !== ''),
    message: 'Las métodos de pago no pueden estar en blanco',
  },
];

module.exports = {
  nameValidations,
  descriptionValidations,
  priceValidations,
  pictureValidations,
  tagsValidations,
  // experienceValidations,
  paymentMethodsValidations,
};
