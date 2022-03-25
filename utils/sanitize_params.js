//Sanitizes the req.query/req.body to return a more legible object.

const sanitizeAdvertParams = (params) => {
  return {
    name: params.name || '',
    description: params.description || '',
    price: params.price || '',
    paymentMethods: params.paymentMethods || '',
    advertImage: params.advertImage || '',
    tags: params.tags,
    experience: params.experience || '',
    offerAdvert: params.offerAdvert || false,
  };
};
module.exports = { sanitizeAdvertParams };
