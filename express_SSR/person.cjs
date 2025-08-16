
const { SQLTable }      = require('logic-sql-entity');
const { SqliteDialect } = require('kysely')
const Database          = require('better-sqlite3')


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

// module.exports = { table }; // 테이블 객체를 CommonJS 방식으로 내보냄
module.exports = table;
