const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

// Sample data (임시 메모리 DB)
let users = [
  { id: 1, name: 'Alicew', age: 25 },
  { id: 2, name: 'Bob', age: 30 }
];

// EJS 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 📄 SSR 화면 렌더링
app.get('/', (req, res) => {
  res.render('index', { users});
});

// ➕ 사용자 추가
app.post('/add', (req, res) => {
  const { name, age } = req.body;
  if (!name || !age) {
    return res.status(400).send('Name and age required');
  }
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name,
    age: parseInt(age)
  };
  users.push(newUser);
  res.redirect('/');
});

// ❌ 사용자 삭제
app.post('/delete/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  users = users.filter(u => u.id !== userId);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`SSR Server running: http://localhost:${PORT}`);
});