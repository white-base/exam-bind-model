const express           = require('express');
const bodyParser        = require('body-parser');
const path              = require('path');
const table             = require('./person.cjs');  // POINT:

const app   = express();
const PORT  = 3000;

// EJS 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 📄 SSR 화면 렌더링
app.get('/', async (req, res) => {
  table.clear();
  await table.select(1, 10);                    // POINT: 페이징 처리
  res.render('index', { output: table });
});

// ➕ 사용자 추가
app.post('/add', async (req, res) => {
  await table.insert(req.body);                 // POINT: req.body를 바로 사용  
  res.redirect('/');
});

// 사용자 수정
app.post('/update/:id', async (req, res) => {
  const userId = req.params.id;
  await table.update({ id: userId, ...req.body }); // POINT: req.body를 바로 사용
  res.redirect('/');
});

// ❌ 사용자 삭제
app.post('/delete/:id', async (req, res) => {
  const userId = req.params.id;
  await table.delete({ id: userId });           // POINT: req.params.id를 바로 사용
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`SSR Server running: http://localhost:${PORT}`);
});