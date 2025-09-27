// controllers/home.controller.js
exports.index = function(req, res) {
  res.render('home/index', { title: 'Home', message: 'Welcome!' });
};

exports.about = function(req, res) {
  res.render('home/about', { title: 'About' });
};