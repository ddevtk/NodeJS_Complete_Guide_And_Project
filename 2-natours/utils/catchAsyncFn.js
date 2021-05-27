module.exports = (fnAsync) => (req, res, next) =>
  fnAsync(req, res, next).catch(next);
