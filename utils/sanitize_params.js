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

const sanitizeUserProfileParams = (params) => {
  return {
    name: params.name || '',
    phone: params.phone || '',
    description: params.description || '',
    url: params.url || '',
    userImage: params.userImage || '',
    rating: params.rating || 0,
    cv: params.cv || '',
  };
};

module.exports = { sanitizeAdvertParams, sanitizeUserProfileParams };
