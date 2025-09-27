// controllers/users.controller.js
// 실무에서는 서비스/리포지토리로 분리해 DB 접근
exports.list = function(req, res) {
  var users = [
    { id: 1, name: 'Neo' },
    { id: 2, name: 'Trinity' }
  ];
  res.render('users/list', { title: 'Users', users: users });
};

exports.detail = function(req, res) {
  var id = parseInt(req.params.id, 10);
  // 예시용 더미
  var user = { id: id, name: 'User ' + id };
  res.render('users/detail', { title: 'User Detail', user: user });
};