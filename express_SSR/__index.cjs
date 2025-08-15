const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
//https://unpkg.com/logic-bind-model@1.1.13/dist/bind-model.node.cjs
// const BindModel = require('https://unpkg.com/logic-bind-model/dist/bind-model.node.cjs');
const {BindModel} = require('logic-bind-model');

const app = express();
const PORT = 3000;

// Sample data (임시 메모리 DB)
// let users = [
//   { id: 1, name: 'Alicew', age: 25 },
//   { id: 2, name: 'Bob', age: 30 }
// ];


var bm = new BindModel();
bm.setMapping({
  id:      { list: '$all' },
  name:   { list: '$all' },
  age:      { list: '$all' }
});

bm.cmd.list.output.read({rows: [{id: 1, name: 'Alice', age: 250}, {id: 2, name: 'Bob', age: 300}]})


// EJS 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 📄 SSR 화면 렌더링
app.get('/', (req, res) => {
  res.render('index', { output: bm.cmd.list.output });
  // REVIEW: render 이전으로 이동 필요
  // await bm.cmd.pick.execute();
});

// ➕ 사용자 추가
app.post('/add', (req, res) => {
  const { name, age } = req.body;
  if (!name || !age) {
    return res.status(400).send('Name and age required');
  }
  // const newUser = {
  //   id: users.length ? users[users.length - 1].id + 1 : 1,
  //   name,
  //   age: parseInt(age)
  // };
  // users.push(newUser);
  const id = bm.cmd.list.output.rows.count + 1;
  bm.cmd.list.output.read({rows: [{id: id, name: name, age: age}]})
  res.redirect('/');

  // REVIEW:
  // bm.User.insert({id: id, name: name, age: age});
  // bm.commit();
});

// ❌ 사용자 삭제
app.post('/delete/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  // users = users.filter(u => u.id !== userId);
  const idx = bm.cmd.list.output.rows.findIndex((row) => row.id === userId);
  bm.cmd.list.output.rows.removeAt(idx);
  res.redirect('/');
  // REVIEW:
  // bm.User.delete({idx: userId});
  // bm.commit();
});

app.listen(PORT, () => {
  console.log(`SSR Server running: http://localhost:${PORT}`);
});