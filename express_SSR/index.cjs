const express           = require('express');
const bodyParser        = require('body-parser');
const path              = require('path');
const { SQLTable }      = require('logic-sql-entity');
const { SqliteDialect } = require('kysely')
const Database          = require('better-sqlite3')

const app   = express();
const PORT  = 3000;
const table = new SQLTable('person');

const conn = {
  dialect: new SqliteDialect({
    database: new Database(':memory:')
  })
};
table.connect = conn;

if (true) { // 컬럼 정의 및 셈플 DB 데이터 (모률 영역) #######################
  table.columns.add('id');    // TODO: add() 파라메터 객체 변경
  table.columns.add('name');
  table.columns.add('age');

  (async () => {
    await table.db.schema
      .createTable('person')
      .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
      .addColumn('name', 'text', (col) => col.notNull())
      .addColumn('age', 'integer', (col) => col.notNull())
      .execute();
  
    await table.insert({ name: '홍길동', age: 30 });
    await table.insert({ name: '김로직', age: 40 });
  })();
}

// EJS 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 📄 SSR 화면 렌더링
app.get('/', async (req, res) => {
  table.clear();    // TODO: 덮어쓰기 옵션 또는 기존 유지 확인 필요!
  await table.select(1, 10);  // TODO: {} 객체 타입으로 변경, 콜백 함수 추가
  res.render('index', { output: table });
});

// ➕ 사용자 추가
app.post('/add', async (req, res) => {
  const { name, age } = req.body; // TODO: insert() 바로 넣으면 제어 가능
  if (!name || !age) {    // TODO: 유효성 검사 insert(), update() 추가 가능
    return res.status(400).send('Name and age required');
  }
  await table.insert({ name: name, age: age });
  res.redirect('/');
});

// ❌ 사용자 삭제
app.post('/delete/:id', async (req, res) => {
  const userId = req.params.id;
  await table.delete({ id: userId });
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`SSR Server running: http://localhost:${PORT}`);
});