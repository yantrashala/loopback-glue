module.exports = function() {
  return function sampleMiddleware(req, res, next) {
    console.log('Sample middleware triggered.');
    next();
  };
};
