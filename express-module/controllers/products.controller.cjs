// controllers/products.controller.js
exports.list = function(req, res) {
  var items = [
    { id: 10, name: 'Keyboard' },
    { id: 11, name: 'Mouse' }
  ];
  res.render('admin/products/list', { title: 'Products', items: items });
};

exports.form = function(req, res) {
  res.render('admin/products/form', { title: 'New Product' });
};

exports.create = function(req, res) {
  // TODO: 검증 & 저장 로직
  // 완료 후 목록으로
  res.redirect('/admin/products');
};
