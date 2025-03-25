/**
 * @jest-environment @bufbuild/jest-environment-jsdom
 */
// ES6, cjs, jest
//==============================================================
// gobal defined
'use strict';

// global.jQuery = global.jQuery || require('jquery');
global.axios = require('axios');

const  axios  = require("axios");

jest.mock('axios');

const bindmodel = require('logic-bind-model');
const {BindModel, HTMLColumn, MetaColumn, MetaTable, MetaView, BindCommand} = global._L;

const T = true;

//==============================================================
// test
describe("[target: exam BindModel]", () => {
    beforeEach(() => {
        jest.resetModules(); 
        logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
        errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });
    afterEach(() => {
        logSpy.mockRestore();
        jest.resetAllMocks(); // 모든 mock을 초기 상태로 되돌림
    });
    describe("주요 클래스", () => {
        describe("BindModel 클래스", () => {
            describe("_columnType", () => {
                it("- 기본값 확인 및 변경", () => {
                    const bm = new BindModel();

                    expect(bm._columnType).toBe(HTMLColumn)

                    // 컬럼 타입 변경
                    bm._columnType = MetaColumn; 
                    expect(bm._columnType).toBe(MetaColumn)
                });
                it("- 컬럼 생성 시 _columnType 적용", () => {
                    const bm = new BindModel();

                    // 기본 컬럼 타입으로 컬럼 추가
                    bm.addColumn('username');
                    expect(bm.columns['username']).toBeDefined()

                    // _columnType 변경 후 컬럼 추가
                    bm._columnType = MetaColumn;
                    bm.addColumn('age');

                    expect(bm.columns['age']).toBeDefined()
                });
            });
            describe("_baseTable", () => {
                it("- 기본테이블 변경", () => {
                    const bm = new BindModel();

                    // 새로운 테이블 추가
                    bm.addTable('second');
                    
                    // 기본 테이블 변경
                    bm._baseTable = bm.second;
                    
                    // 변경된 기본 테이블에 컬럼 추가
                    bm.addColumn('username');
                    
                    expect(bm.second.columns['username']instanceof HTMLColumn).toBe(T)
                    expect(bm.columns['username']instanceof HTMLColumn).toBe(T)
                });
            });
            describe("_tables", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    // 테이블 추가
                    bm.addTable('second');
                    bm.addTable('three');
                    
                    // 테이블 이름으로 접근
                    expect(bm._tables['first'] instanceof MetaTable).toBe(T)
                    expect(bm._tables['second'] instanceof MetaTable).toBe(T)
                    expect(bm._tables['three'] instanceof MetaTable).toBe(T)
                    
                    // 테이블 인덱스로 접근
                    expect(bm._tables[0] instanceof MetaTable).toBe(T)
                    expect(bm._tables[1] instanceof MetaTable).toBe(T)
                    expect(bm._tables[2] instanceof MetaTable).toBe(T)
                });
            });
            describe("baseConfig", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    bm.baseConfig = {
                        url: '/api/data',
                        method: 'POST',
                        responseType: 'json',
                        headers: { Authorization: 'Bearer token' }
                    };
                    
                    expect(bm.baseConfig).toEqual({
                        "url": "/api/data",
                        "method": "POST",
                        "responseType": "json",
                        "headers": {
                            "Authorization": "Bearer token",
                        },
                    })
                });
            });
            describe("url", () => {
                it("- 기본 url 설정", () => {
                    const bm = new BindModel();
                    bm.url = '/api/users';
                    
                    expect(bm.baseConfig).toEqual({
                        "method": "GET", 
                        "responseType": "json", 
                        "url": "/api/users"
                    })           
                    
                });
                it("- 명령에서 url 사용시", () => {
                    const bm = new BindModel();
                    bm.url = '/users';
                    
                    // 명령 추가
                    bm.addCommand('cmd1');
                    bm.addCommand('cmd2');
                    
                    // 경로 설정
                    bm.command['cmd2'].url = '/api';
                    
                    // 명령 실행
                    // bm.command['cmd1'].execute(); // 요청 경로 : '/users'
                    // bm.command['cmd2'].execute(); // 요청 경로 : '/api'    
                    expect(bm.command['cmd1'].url).toBe(null);
                    expect(bm.url).toBe('/users');
                    expect(bm.command['cmd2'].url).toBe('/api');
                    
                });
            });
            describe("first", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    // 테이블에 컬럼 추가
                    bm.first.columns.add('id');
                    bm.first.columns.add('username');
                    
                    expect(bm.first.columns['username'] instanceof HTMLColumn).toBe(T)
                    expect(bm._baseTable.columns['username'] instanceof HTMLColumn).toBe(T)
                    expect(bm._tables['first'].columns['username'] instanceof HTMLColumn).toBe(T)
                    expect(bm.columns['username'] instanceof HTMLColumn).toBe(T)       
                });
            });
            describe("columns", () => {
                it("- 컬럼 컬렉션에서 컬럼 추가", () => {
                    const bm = new BindModel();

                    bm.columns.add('username');
                    
                    expect(bm.columns['username'] instanceof HTMLColumn).toBe(T)
                });
                it("- 기본 테이블 변경 시 컬럼 추가", () => {
                    const bm = new BindModel();

                    // 기본 테이블에 컬럼 추가
                    bm.columns.add('email');
                    
                    // 기본 테이블 변경
                    bm._baseTable = bm.addTable('second');
                    
                    // 새로운 테이블에 컬럼 추가
                    bm.columns.add('age');
                    
                    expect(bm.first.columns['email'] instanceof HTMLColumn).toBe(T)
                    expect(bm.second.columns['age'] instanceof HTMLColumn).toBe(T)
                    expect(bm.columns['age'] instanceof HTMLColumn).toBe(T)        
                });
            });
            describe("items", () => {
                it("- items 속성에 추가", () => {
                    const bm = new BindModel();

                    // items 추가
                    bm.items.add('username', 'Alice');
                    bm.items.add('id', { value: 3, default: 0 });
                    
                    // 속성 조회
                    expect(bm.items['username']).toBe('Alice')
                    expect(bm.items['id']).toEqual({ value: 3, default: 0 })                      
                });
                it("- items 속성과 테이블 매핑", () => {
                    const bm = new BindModel();

                    // 새로운 테이블 추가
                    bm.addTable('second');
                    
                    // items 추가
                    bm.items.add('aa', 10);
                    bm.items.add('bb', 20);
                    
                    // 테이블 매핑 설정
                    bm.setMapping({
                        'aa': {},
                        'first.bb': {},
                        'second.bb': {}
                    });
                    
                    // 속성 및 컬럼 상태 확인
                    expect(bm.items.count).toBe(2)
                    expect(bm.first.columns.count).toBe(2)
                    expect(bm.second.columns.count).toBe(1)
                    expect(bm.first.columns['aa'].value).toBe(10)
                    expect(bm.first.columns['bb'].value).toBe(20)
                    expect(bm.second.columns['bb'].value).toBe(20)
                });
            });
            describe("fn", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    // 사용자 정의 함수 추가
                    bm.fn.add('calculateSum', (a, b) => a + b);
                    
                    // 콜백함수에서 호출
                    bm.cbBaseBegin = function(cmd) {
                        const model = cmd._model;
                        bm.fn.calculateSum(5, 10);
                    };
                    
                    expect(bm.fn['calculateSum'](5, 10)).toBe(15)
                });
            });
            describe("command", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    // 명령 추가
                    bm.addCommand('cmd1');
                    
                    // 명령 실행
                    // bm.command['cmd1'].execute();
                    // bm.cmd['cmd1'].execute();
                    // bm.cmd[0].execute();
                    expect(bm.command['cmd1'] instanceof BindCommand).toBe(T)
                    expect(bm.cmd['cmd1'] instanceof BindCommand).toBe(T)
                    expect(bm.cmd[0] instanceof BindCommand).toBe(T)
                });
            });
            describe("cbFail", () => {
                it("- 예제", async () => {
                    const bm = new BindModel();

                    bm.cbFail = function (msg, view) {
                        console.warn(`failed: ${msg}`);
                    };

                    bm.addCommand('cmd1');
                    bm.addColumnValue('username', { required: true }, 'cmd1', 'valid');
                    await bm.command['cmd1'].execute();

                    expect(warnSpy.mock.calls[0][0]).toMatch(/EL05138/);
                });
            });
            describe("cbError", () => {
                it("- 전역 오류 처리: no test:", () => {
                    const bm = new BindModel();

                    bm.cbError = function(msg, status, response) {
                        console.error(`Error occurred: ${msg}`);
                        if (status) console.log(`Status: ${status}`);
                        if (response) console.log(`Response:`, response);
                    };
                    
                    // 명령 실행 중 오류가 발생하면 cbError가 호출됩니다.                    
                });
                it("- 사용자 정의 오류 처리: no test:", () => {
                    const bm = new BindModel();

                    bm.cbError = function(msg, status, response) {
                        alert(`An error occurred: ${msg}`);
                    };
                    
                    // 명령 실행 중 오류가 발생하면 사용자에게 알림 메시지를 표시합니다.                    
                });
            });
            describe("cbBaseBegin", () => {
                // beforeEach(() => {
                //     const body = {
                //         "rows": {
                //             "aa": 10,
                //             "bb": "S1",
                //             "cc": false
                //         }
                //     };
                //     const res = {data: body, status: 200};
                //     axios.mockResolvedValue(res);
                // });
                it("- 예제", async () => {
                    const bm = new BindModel();

                    bm.cbBaseBegin = function (cmd) {
                        console.log(`Command is about to execute.`);
                        // Out: `Command "XXX" is about to execute.`
                    };     

                    bm.addCommand('cmd1');
                    await bm.command['cmd1'].execute();

                    expect(logSpy.mock.calls[0][0]).toBe("Command is about to execute.");
                });
            });
            describe("cbBaseValid", () => {
                it("- 예제", async () => {
                    const bm = new BindModel();

                    bm.addCommand('cmd1');
                    bm.addColumn('username', 'cmd1', 'valid');

                    // 콜백 함수 설정
                    bm.cbBaseValid = function (view, cmd) {
                        const username = view.columns['username'].value;
                        if (!username || username.length < 3) {
                            console.log('사용자 이름은 3자 이상이어야 합니다.');
                            return false;
                        }
                        return true;
                    };
                    
                    // 명령 실행
                    await bm.command['cmd1'].execute();

                    expect(logSpy.mock.calls[0][0]).toBe("사용자 이름은 3자 이상이어야 합니다.");
                    expect(warnSpy.mock.calls[0][0]).toBe("Failed. Err:valid 검사가 실패하였습니다.");
                });
            });
            describe("cbBaseBind", () => {
                it("- 예제", async () => {
                    const bm = new BindModel();

                    bm.addCommand('sendData');
                    
                    // 콜백 함수 설정
                    bm.cbBaseBind = function(bind, cmd, config) {
                        config.headers = {
                            Authorization: 'Bearer token'
                        };
                        console.log('headers');
                    };
                    
                    // 명령 실행
                    await bm.command['sendData'].execute();

                    expect(logSpy.mock.calls[0][0]).toBe("headers");
                });
            });
            describe("cbBaseResult", () => {
                beforeEach(() => {
                    const body = {
                        "rows": [
                            {"aa": 10, "inStock": false},
                            {"aa": 20, "inStock": true},
                            {"aa": 30, "inStock": true},
                        ]
                    };
                    const res = {data: body, status: 200};
                    axios.mockResolvedValue(res);
                });
                it("- 예제", async () => {
                    const bm = new BindModel();

                    bm.addCommand('cmd1', 1);
                    
                    // 콜백 함수 설정
                    bm.cbBaseResult = function(data, cmd, response) {
                        return { rows: data.rows.filter(product => product.inStock) };
                    };
                    
                    // 명령 실행
                    await bm.command['cmd1'].execute(); 
                    
                    expect(bm.command['cmd1'].output.rows.count).toBe(2);
                });
            });
            describe("cbBaseOutput", () => {
                beforeEach(() => {
                    const body = {
                        "rows": [
                            {"id": 10, "name": 'aa'},
                            {"id": 20, "name": 'bb'}
                        ]
                    };
                    const res = {data: body, status: 200};
                    axios.mockResolvedValue(res);
                });
                it("- 예제", async () => {
                    const bm = new BindModel();

                    bm.addCommand('cmd1', 1); // 모든 컬럼의 데이터 가져옴
                    
                    // 콜백 함수 설정
                    bm.cbBaseOutput = function(outputs, cmd, response) {
                        const output = outputs[0]; // 첫번째 기본 MetaView 선택
                        output.rows.forEach(product => {
                            console.log(`Product ID: ${product.id}, Name: ${product.name}`);
                        });
                    };
                    
                    await bm.command['cmd1'].execute();

                    expect(logSpy.mock.calls[0][0]).toBe("Product ID: 10, Name: aa");
                    expect(logSpy.mock.calls[1][0]).toBe("Product ID: 20, Name: bb");
                });
            });
            describe("cbBaseEnd",  () => {
                it("- 예제", async () => {
                    const bm = new BindModel();

                    bm.addCommand('saveData');
                    
                    // 콜백 함수 설정
                    bm.cbBaseEnd = function(status, cmd, response) {
                        if (status > 0) console.log('데이터 저장이 완료되었습니다.');
                        else console.log('데이터 저장 중 오류가 발생했습니다.');
                    };
                    
                    await bm.command['saveData'].execute();   
                    
                    expect(logSpy.mock.calls[0][0]).toBe("데이터 저장 중 오류가 발생했습니다.");
                    
                });
            });
            describe("preRegister", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    bm.preRegister = function (model) {
                        console.log('Registering the model...');
                    };
                    
                    bm.init();

                    expect(logSpy.mock.calls[0][0]).toBe("Registering the model...");
                });
            });
            describe("preCheck", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    bm.preCheck = function (model) {
                        const result = model.checkSelector();  // selector 속성의 유효성 검사
                        if (result.length > 0) console.error('selector fail...');
                        console.error('selector fail...');
                        return true;
                    };
                    
                    bm.init();
                    
                    expect(errorSpy.mock.calls[0][0]).toBe("selector fail...");
                });
            });
            describe("preReady", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    bm.preReady = function (model) {
                        console.log('ready...');
                    };
                    
                    bm.init();
                    
                    expect(logSpy.mock.calls[0][0]).toBe("ready...");
                });
            });
            describe("addTable()", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    bm.addTable('second');
                    
                    bm._tables['first'] === bm.first   // true
                    bm._tables['second'] === bm.second // true        
                    
                    expect(bm._tables['first'] === bm.first).toBe(T);
                    expect(bm._tables['second'] === bm.second).toBe(T);
                });
            });
            describe("addCommand()", () => {
                it("- 명령 추가", () => {
                    const bm = new BindModel();

                    bm.addCommand('create');
                    bm.addCommand('read', 3);
                    
                    expect(bm.command['create'].outputOption).toEqual({ option: 0, index: 0 })
                    expect(bm.command['read'].outputOption).toEqual({ option: 3, index: 0 })
                });
                it("- 테이블 지정 명령 추가", () => {
                    const bm = new BindModel();

                    bm.addTable('second');
                    
                    bm.addCommand('create', 0, 'second');
                    
                    expect(bm.command['create'] instanceof BindCommand).toBe(T)
                    expect(bm.command['create'].outputOption).toEqual({ option: 0, index: 0 })
                    expect(bm.command['create']._baseTable instanceof MetaTable).toBe(T)
                });
            });
            describe("addColumn()", () => {
                it("- 컬럼 추가 ", () => {
                    const bm = new BindModel();

                    // 컬럼 추가
                    bm.addColumn('gender');
                    
                    expect(bm.columns['gender'] instanceof HTMLColumn).toBe(T);
                    expect(bm.first.columns['gender'] instanceof HTMLColumn).toBe(T);
                    expect(bm._tables['first'].columns['gender'] instanceof HTMLColumn).toBe(T);
                });
                it("- 컬럼 추가 및 모든 뷰에 매핑", () => {
                    const bm = new BindModel();
                    // 명령 등록
                    bm.addCommand('cmd1');

                    // 컬럼 추가 및 명령에 매핑
                    bm.addColumn('username', 'cmd1');

                    expect(bm.cmd['cmd1'].valid.columns['username'] instanceof HTMLColumn).toBe(T);
                    expect(bm.cmd['cmd1'].bind.columns['username'] instanceof HTMLColumn).toBe(T);
                    expect(bm.cmd['cmd1'].output.columns['username'] instanceof HTMLColumn).toBe(T);
                    expect(bm.cmd['cmd1'].misc.columns['username'] instanceof HTMLColumn).toBe(T);
                });
                it("- 컬럼 추가 및 특정 뷰에 매핑", () => {
                    const bm = new BindModel();
                    // 명령 등록
                    bm.addCommand('cmd1');

                    // 컬럼 추가 및 명령에 매핑
                    bm.addColumn('email', 'cmd1', 'valid');
                    bm.addColumn('phone', 'cmd1', ['bind','output']);

                    expect(bm.command['cmd1'].valid.columns['email'] instanceof HTMLColumn).toBe(T);
                    expect(bm.command['cmd1'].bind.columns['phone'] instanceof HTMLColumn).toBe(T);
                    expect(bm.command['cmd1'].output.columns['phone'] instanceof HTMLColumn).toBe(T);
                });
                it("- 사용자 정의 출력 뷰에 추가", () => {
                    const bm = new BindModel();
                    // 명령 등록
                    bm.addCommand('cmd1');

                    // 출력 뷰 추가
                    bm.command['cmd1'].newOutput('out2');

                    // 컬럼 추가 및 명령에 매핑
                    bm.addColumn('address', 'cmd1', 'out2');

                    expect(bm.command['cmd1'].out2.columns['address'] instanceof HTMLColumn).toBe(T);
                });
            });
            describe("addColumnValue()", () => {
                it("- 컬럼 추가 ", () => {
                    const bm = new BindModel();

                    // 컬럼 추가
                    bm.addColumnValue('gender', 'Man');
                    
                    expect(bm.columns['gender'].value).toBe('Man')
                    expect(bm.first.columns['gender'].value).toBe('Man')
                    expect(bm._tables['first'].columns['gender'].value).toBe('Man')        
                });
                it("- 컬럼 추가 및 모든 뷰에 매핑", () => {
                    const bm = new BindModel();
                    // 명령 등록
                    bm.addCommand('cmd1');

                    // 컬럼 추가 및 명령에 매핑
                    bm.addColumnValue('username', 'Jane', 'cmd1');

                    expect(bm.cmd['cmd1'].valid.columns['username'].value).toBe('Jane')
                    expect(bm.cmd['cmd1'].bind.columns['username'].value).toBe('Jane')
                    expect(bm.cmd['cmd1'].output.columns['username'].value).toBe('Jane')
                    expect(bm.cmd['cmd1'].misc.columns['username'].value).toBe('Jane')
                });
                it("- 컬럼 추가 및 특정 뷰에 매핑", () => {
                    const bm = new BindModel();
                    // 명령 등록
                    bm.addCommand('cmd1');

                    // 컬럼 추가 및 명령에 매핑
                    bm.addColumnValue('email', 'abc@gmail.com', 'cmd1', 'valid');
                    bm.addColumnValue('phone', '010-1234', 'cmd1', ['bind','output']);

                    expect(bm.cmd['cmd1'].valid.cols['email'].value).toBe('abc@gmail.com')
                    expect(bm.cmd['cmd1'].bind.cols['phone'].value).toBe('010-1234')
                    expect(bm.cmd['cmd1'].output.cols['phone'].value).toBe('010-1234')
                });
                it("- 사용자 정의 출력 뷰에 추가", () => {
                    const bm = new BindModel();
                    // 명령 등록
                    bm.addCommand('cmd1');

                    // 출력 뷰 및 컬럼 추가
                    bm.command['cmd1'].newOutput('out2');
                    bm.addColumnValue('address', 'USA', 'cmd1', 'out2');

                    expect(bm.command['cmd1'].out2.columns['address'].value).toBe('USA')
                });
            });
            describe("setService()", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    const svc = { tables: ['second'] };
                    
                    // 서비스 객체 주입
                    bm.setService(svc);
                    
                    expect(bm.second instanceof MetaTable).toBe(T)
                });
            });
            describe("setMapping()", () => {
                it("- 명령과 연계된 매핑 ", () => {
                    const bm = new BindModel();

                    bm.addCommand('cmd1');
                    bm.addCommand('cmd2');
                    
                    bm.setMapping({
                        'username': { cmd1: 'valid'},
                        'password': { cmd1: 'valid', cmd2: ['valid', 'bind'] }
                    });
                    
                    expect(bm.command['cmd1'].valid.cols['username'] instanceof HTMLColumn).toBe(T)
                    expect(bm.command['cmd1'].valid.cols['password'] instanceof HTMLColumn).toBe(T)
                    expect(bm.command['cmd2'].valid.cols['password'] instanceof HTMLColumn).toBe(T)
                    expect(bm.command['cmd2'].bind.cols['password'] instanceof HTMLColumn).toBe(T)
                });
                it("- 두번째 테이블과 명령", () => {
                    const bm = new BindModel();

                    bm.addTable('second');
                    
                    bm.addCommand('read1');
                    bm.addCommand('read2');
                    
                    bm.setMapping({
                        aa: { $all: 'valid' },
                        bb: { $all: 'bind' },
                        'second.cc': { $all: 'output' }
                    });
                    
                    expect(bm.first.columns.count).toBe(2);  // 2
                    expect(bm.second.columns.count).toBe(1); // 1
                    expect(bm.command['read1'].valid.cols['aa'] instanceof HTMLColumn).toBe(T)
                    expect(bm.command['read1'].bind.cols['bb'] instanceof HTMLColumn).toBe(T)
                    expect(bm.command['read1'].output.cols['cc'] instanceof HTMLColumn).toBe(T)
                    
                    expect(bm.command['read2'].valid.cols['aa'] instanceof HTMLColumn).toBe(T)
                    expect(bm.command['read2'].bind.cols['bb'] instanceof HTMLColumn).toBe(T)
                    expect(bm.command['read2'].output.cols['cc'] instanceof HTMLColumn).toBe(T)
                });
            });
            describe("init()", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    bm.preRegister = function(model) {
                        console.log('Registering the model...');
                    };
                    bm.preCheck = function(model) {
                        console.log('Checking the model...');
                        return true;
                    };
                    bm.preReady = function(model) {
                        console.log('Model is ready...');
                    };
                    
                    bm.init();
                    
                    expect(logSpy.mock.calls[0][0]).toBe('Registering the model...')
                    expect(logSpy.mock.calls[1][0]).toBe('Checking the model...')
                    expect(logSpy.mock.calls[2][0]).toBe('Model is ready...')
                });
            });
            describe("checkSelector(): no test:", () => {
                it.skip("- 예제", () => {
                    const bm = new BindModel();

                    // 아이템에 selector 객체 추가
                    bm.items.add('username', { selector: { key: 'input#username', type: 'value' }})
                    
                    // 검사
                    const failList = bm.checkSelector();
                    
                    expect(failList).toEqual([{ key: 'input#username', type: 'value' }])
                    
                });
            });
            describe("getSelector()", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    // 아이템 추가
                    bm.items.add('u_name', { selector: { key: 'input#u_name', type: 'value' }})
                    bm.items.add('passwd', { selector: { key: 'input#passwd', type: 'value' }})
                    
                    // 조회
                    const list = bm.getSelector();
                    
                    expect(list[0]).toEqual({ key: 'input#u_name', type: 'value' })
                    expect(list[1]).toEqual({ key: 'input#passwd', type: 'value' })
                });
            });
            describe("onExecute", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    bm.onExecute = function(model, cmd) {
                        console.log('Execute start...');
                    };
                    
                    // 명령 추가 및 실행
                    bm.addCommand('cmd1');
                    bm.command['cmd1'].execute();
                    
                    expect(logSpy.mock.calls[0][0]).toBe('Execute start...')
                });
            });
            describe("onExecuted", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    bm.onExecuted = function(model, cmd) {
                        console.log('Execute End...');
                    };
                    
                    // 명령 추가 및 실행
                    bm.addCommand('cmd1');
                    bm.command['cmd1'].execute();
                    
                    expect(logSpy.mock.calls[0][0]).toBe('Execute End...')
                });
            });

        });
        describe("BindCommand 클래스", () => {
            describe("_baseTable", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    expect(bm._baseTable === bm.first).toBe(T)
                    expect(bm._baseTable === bm._tables['first']).toBe(T)
                    expect(bm._baseTable === bm._tables[0]).toBe(T)
                });
            });
            describe("_outputs", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    // 명령 추가
                    bm.addCommand('list');
                    
                    // 출력 뷰 추가
                    bm.command['list'].newOutput();
                    
                    // 명령 실행
                    bm.command['list'].execute();
                    
                    expect(bm.command['list']._outputs[0] instanceof MetaView)
                    expect(bm.command['list']._outputs[1] instanceof MetaView)  
                });
            });
            describe("_model", () => {
                it("- 예제", async () => {
                    const bm = new BindModel();

                    bm.addColumnValue('u_id', 'abc');
                    bm.addCommand('list');
                    
                    bm.command['list'].cbBegin = function(cmd) {
                        console.log(cmd._model.columns['u_id'].value); // Out: 'abc'
                    };
                    
                    await bm.cmd['list'].exec();
                    expect(logSpy.mock.calls[0][0]).toBe('abc')
                });
            });
            describe("config", () => {
                it("- 예제", async () => {
                    const bm = new BindModel();

                    bm.addCommand('cmd1');
                    
                    // 명령의 서버 요청 설정
                    bm.command['cmd1'].config = {
                        method: 'GET',
                        url: '/api/users',
                        headers: { Authorization: 'Bearer token123' },
                        timeout: 5000
                    };
                    
                    bm.cbBaseBind = (bind, cmd, config) => { 
                        console.log(config) 
                    }

                    // 명령 실행
                    await bm.command['cmd1'].execute();

                    expect(logSpy.mock.calls[0][0]).toEqual({
                        method: 'GET',
                        url: '/api/users',
                        headers: { Authorization: 'Bearer token123' },
                        timeout: 5000,
                        responseType: "json",
                        data: {}
                    })
                });
            });
            describe("url", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    // 명령 추가
                    bm.addCommand('cmd1');
                    
                    // URL 설정
                    bm.command['cmd1'].url = '/api/data';
                    
                    bm.cbBaseBind = (bind, cmd, config) => { 
                        console.log(config.url) 
                    }
                    bm.command['cmd1'].execute();       
                    
                    expect(logSpy.mock.calls[0][0]).toBe('/api/data')
                });
                it("- 동적 url 설정", () => {
                    const bm = new BindModel();

                    // 명령 및 컬럼 추가
                    bm.addCommand('cmd1');
                    bm.addColumnValue('u_id', 10);
                    
                    // 동적 URL 설정
                    bm.command['cmd1'].cbBegin = function(cmd) {
                        const userId = cmd._model.columns['u_id'].value;
                        cmd.url = `/api/users/${userId}`;
                    };
                    
                    bm.cbBaseBind = (bind, cmd, config) => { 
                        console.log(config.url) 
                    }
                    bm.command['cmd1'].execute();     
                    
                    expect(logSpy.mock.calls[0][0]).toBe('/api/users/10')
                });
            });
            describe("outputOption", () => {
                it("- outputOption 직접 설정", () => {
                    const bm = new BindModel();

                    // 명령 추가 
                    bm.addCommand('cmd1');
                    bm.addCommand('cmd2');
                    bm.addCommand('cmd3');
                    bm.addCommand('cmd4');
                    
                    // 및 outputOption 설정
                    bm.command['cmd2'].outputOption = 1;
                    bm.command['cmd3'].outOpt = { option: 2 }
                    bm.command['cmd4'].outputOption = { option: 3, index: 2 };
                    // 명령 실행
                    bm.command['cmd1'].execute();   // option = 0, index = 0
                    bm.command['cmd2'].execute();   // option = 1, index = 0
                    bm.command['cmd3'].execute();   // option = 2, index = 0
                    bm.command['cmd4'].execute();   // option = 3, index = 2 
                    
                    expect(bm.cmd['cmd1'].outOpt).toEqual({ option: 0, index: 0 })
                    expect(bm.cmd['cmd2'].outOpt).toEqual({ option: 1, index: 0 })
                    expect(bm.cmd['cmd3'].outOpt).toEqual({ option: 2, index: 0 })
                    expect(bm.cmd['cmd4'].outOpt).toEqual({ option: 3, index: 2 })
                });
                it("- 명령 추가시 outputOption 설정", () => {
                    const bm = new BindModel();

                    // 명령 추가 및 outputOption 설정
                    bm.addCommand('cmd1');
                    bm.addCommand('cmd2', 1);
                    bm.addCommand('cmd3', { option: 2});
                    bm.addCommand('cmd4', { option: 3, index: 2 });
                    
                    // 명령 실행
                    bm.command['cmd1'].execute();   // option = 0, index = 0
                    bm.command['cmd2'].execute();   // option = 1, index = 0
                    bm.command['cmd3'].execute();   // option = 2, index = 0
                    bm.command['cmd4'].execute();   // option = 3, index = 2

                    expect(bm.cmd['cmd1'].outOpt).toEqual({ option: 0, index: 0 })
                    expect(bm.cmd['cmd2'].outOpt).toEqual({ option: 1, index: 0 })
                    expect(bm.cmd['cmd3'].outOpt).toEqual({ option: 2, index: 0 })
                    expect(bm.cmd['cmd4'].outOpt).toEqual({ option: 3, index: 2 })
                });
            });
            describe("valid", () => {
                it("- 예제", async () => {
                    const bm = new BindModel();

                    bm.addCommand('cmd1');
                    
                    // 컬럼 추가
                    bm.command['cmd1'].valid.columns.add('u_id');
                    bm.command['cmd1'].valid.columns.add('phone');
                    // 위와 동일
                    // bm.command['cmd1'].addColumn('u_id', 'valid');
                    // bm.command['cmd1'].addColumn('phone', 'valid');
                    
                    // 제약 조건 설정
                    bm.columns['u_id'].required = true;
                    bm.columns['phone'].constraints = {
                        regex: /^\d{10,11}$/,
                        msg: '전화번호는 10~11자리 숫자여야 합니다.'
                    };
                    
                    await bm.command['cmd1'].execute();

                    expect(warnSpy.mock.calls[0][0]).toMatch(/EL05138/)

                });
            });
            describe("bind", () => {
                it("- 예제", async () => {
                    const bm = new BindModel();

                    bm.addCommand('cmd1');
                    
                    // 컬럼 추가
                    bm.command['cmd1'].bind.columns.add('u_id');
                    bm.command['cmd1'].bind.columns.add('email');
                    bm.command['cmd1'].bind.columns['u_id'].value = 101;
                    bm.command['cmd1'].bind.columns['email'].value = 'abc@gmail.com';
                    // 위와 동일
                    // bm.command['cmd1'].addColumnValue('u_id', 101, 'bind');
                    // bm.command['cmd1'].addColumnValue('email', 'abc@gmail.com', 'bind');
                    
                    bm.cbBaseBind = (bind, cmd, config) => { 
                        console.log(config.data) 
                    }

                    await bm.command['cmd1'].execute();   
                    
                    expect(logSpy.mock.calls[0][0]).toEqual({
                        "email": "abc@gmail.com",
                        "u_id": 101
                    })
                });
            });
            describe("output", () => {
                beforeEach(() => {
                    const body = {
                        "rows": {
                            "u_id": 10,
                            "u_name": "AA"
                        }
                    };
                    const res = {data: body, status: 200};
                    axios.mockResolvedValue(res);
                });
                it("- 예제", async () => {
                    const bm = new BindModel();

                    // 명령 추가 : 첫번째 데이터(row)를 컬럼값에 설정
                    bm.addCommand('cmd1', 3);
                    
                    // 응답 데이터를 처리할 컬럼 추가
                    bm.command['cmd1'].output.columns.add('u_id');
                    bm.command['cmd1'].output.columns.add('u_name');
                    // 위와 동일
                    // bm.command['cmd1'].addColumn('u_id', 'output');
                    // bm.command['cmd1'].addColumn('u_name', 'output');
                    
                    // 명령 실행
                    await bm.command['cmd1'].execute();
                    
                    console.log(bm.columns['u_id']);  // [Object HTMLColumn]
                    console.log(bm.command['u_name']); // [Object HTMLColumn]        
                    
                    expect(bm.columns['u_id'].value).toBe(10)
                    expect(bm.columns['u_name'].value).toBe('AA')
                });
            });
            describe("misc", () => {
                it("- 예제", () => {
                    
                });
            });
            describe("cbBegin", () => {
                it("- 예제", async () => {
                    const bm = new BindModel();

                    // 명령 추가 및 컬럼 값 설정
                    bm.addCommand('cmd1');
                    bm.addColumnValue('u_id', 100);
                    
                    // 콜백 함수 설정
                    bm.command['cmd1'].cbBegin = function(cmd) {
                        const userId = cmd._model.columns['u_id'].value;
                        cmd.url = `/api/users/${userId}`;
                    };
                    
                    bm.cbBaseBind = (bind, cmd, config) => { 
                        console.log(cmd.url) 
                    }

                    // 명령 실행
                    await bm.command['cmd1'].execute();       
                   
                    expect(logSpy.mock.calls[0][0]).toBe('/api/users/100')
                });
            });
            describe("cbValid", () => {
                it("- 예제", async () => {
                    const bm = new BindModel();

                    // 명령 추가 
                    bm.addCommand('cmd1');
                    
                    // 컬럼 추가 및 뷰 매핑
                    bm.addColumnValue('u_name', 'John', 'cmd1', 'valid');
                    
                    // 콜백 함수 설정
                    bm.command['cmd1'].cbValid = function(view, cmd) {
                        const username = view.columns['u_name'].value;
                        if (username.length < 5) {
                            console.log('사용자 이름은 5자 이상이어야 합니다.');
                            return false;
                        }
                        return true;
                    };
                    
                    // 명령 실행
                    await bm.command['cmd1'].execute();

                    expect(logSpy.mock.calls[0][0]).toBe('사용자 이름은 5자 이상이어야 합니다.')
                    expect(warnSpy.mock.calls[0][0]).toBe('Failed. Err:valid 검사가 실패하였습니다.')
                });
            });
            describe("cbBind", () => {
                it("- 예제", async () => {
                    const bm = new BindModel();

                    // 명령 추가
                    bm.addCommand('upload');
                    
                    // 컬럼 추가 및 뷰 매핑
                    bm.addColumnValue('file_name', 'file.txt', 'upload', 'bind');
                    bm.addColumnValue('file_size', 2048, 'upload', 'bind');
                    
                    // 콜백 함수 설정
                    bm.command['upload'].cbBind = function(bind, cmd, config) {
                        config.headers = {
                            'Content-Type': 'application/json'
                        };
                        console.log(config.headers)
                    };
                    
                    // 명령 실행
                    await bm.command['upload'].execute();       
                    
                    expect(logSpy.mock.calls[0][0]).toEqual({'Content-Type': 'application/json'})
                    
                });
            });
            describe("cbResult", () => {
                beforeEach(() => {
                    const body = {
                        "rows": [
                            { "u_id": 10, "inStock": true },
                            { "u_id": 20, "inStock": false },
                            { "u_id": 30, "inStock": true }
                        ] 
                    };
                    const res = {data: body, status: 200};
                    axios.mockResolvedValue(res);
                });
                it("- 예제", async () => {
                    const bm = new BindModel();

                    // 명령 추가
                    bm.addCommand('cmd1', 1);
                    
                    // 콜백 함수 설정
                    bm.command['cmd1'].cbResult = function(data, cmd, response) {
                        return { rows: data.rows.filter(product => product.inStock) };
                    };
                    
                    // 명령 실행
                    await bm.command['cmd1'].execute();     
                    
                    expect(bm.command['cmd1'].output.rows.count).toBe(2)
                });
            });
            describe("cbOutput", () => {
                beforeEach(() => {
                    const body = {
                        "rows": [
                            { "u_id": 10, "name": 'John' },
                            { "u_id": 20, "name": 'Jane' }
                        ] 
                    };
                    const res = {data: body, status: 200};
                    axios.mockResolvedValue(res);
                });
                it("- 예제", async () => {
                    const bm = new BindModel();

                    // 명령 추가 (1: 모든 데이터 가져오기)
                    bm.addCommand('cmd1', 1);
                    
                    // 콜백 함수 설정
                    bm.command['cmd1'].cbOutput = function(outputs, cmd, response) {
                        const output = outputs[0]; // 첫번째 기본 MetaView
                        output.rows.forEach(product => {
                            console.log(`Product ID: ${product.u_id}, Name: ${product.name}`);
                        });
                    };
                    
                    await bm.command['cmd1'].execute();

                    expect(logSpy.mock.calls[0][0]).toBe('Product ID: 10, Name: John')
                    expect(logSpy.mock.calls[1][0]).toBe('Product ID: 20, Name: Jane')

                });
            });
            describe("cbEnd", () => {
                it("- 예제", async () => {
                    const bm = new BindModel();

                    // 명령 추가
                    bm.addCommand('cmd1');
                    
                    // 콜백 함수 설정
                    bm.command['cmd1'].cbEnd = function(status, cmd, response) {
                        if (status > 0) console.log('데이터 저장이 완료되었습니다.');
                        else console.log('데이터 저장 중 오류가 발생했습니다.');
                    };
                    
                    await bm.command['cmd1'].execute();    
                    
                    expect(logSpy.mock.calls[0][0]).toBe('데이터 저장 중 오류가 발생했습니다.')
                    expect(errorSpy.mock.calls[0][0]).toMatch(/An error has occurred/)
                    
                });
            });
            describe("execute()", () => {
                it("- 예제", async () => {
                    const bm = new BindModel();

                    // 명령 추가
                    bm.addCommand('cmd1');
                    
                    // 유효성 검사 및 서버 요청 추가
                    bm.command['cmd1'].addColumn('u_name', ['valid', 'bind']);
                    
                    // 값 및 제약 조건 설정
                    bm.columns['u_name'].require = true;
                    bm.columns['u_name'].value = 'John';
                    
                    bm.cbBaseBind = (bind, cmd, config) => { 
                        console.log(config.data) 
                    }

                    // 명령 실행
                    await bm.command['cmd1'].execute();

                    expect(logSpy.mock.calls[0][0]).toEqual({"u_name": "John"})
                });
            });
            describe("addColumn()", () => {
                it("- 모든 뷰에 컬럼 추가", () => {
                    const bm = new BindModel();

                    // 명령 및 컬럼 추가
                    bm.addCommand('cmd1');
                    bm.command['cmd1'].addColumn('u_name');
                    // 위와 동일
                    // bm.command['cmd1'].addColumn('u_name', '$all'); 
                   
                    // console.log(bm.command['cmd1'].valid.columns['u_name']); // [Object HTMLColumn]
                    // console.log(bm.command['cmd1'].bind.columns['u_name']);  // [Object HTMLColumn]
                    // console.log(bm.command['cmd1'].output.columns['u_name']);// [Object HTMLColumn]
                    // console.log(bm.command['cmd1'].misc.columns['u_name']);  // [Object HTMLColumn]
                    
                    expect(bm.cmd['cmd1'].valid.cols['u_name'] instanceof HTMLColumn).toBe(T)
                    expect(bm.cmd['cmd1'].bind.cols['u_name'] instanceof HTMLColumn).toBe(T)
                    expect(bm.cmd['cmd1'].output.cols['u_name'] instanceof HTMLColumn).toBe(T)
                    expect(bm.cmd['cmd1'].misc.cols['u_name'] instanceof HTMLColumn).toBe(T)
                });
                it("- 특정 뷰에만 컬럼 등록", () => {
                    const bm = new BindModel();
                    bm.addCommand('cmd1');

                    // 컬럼 추가 및 뷰에 참조 등록
                    bm.command['cmd1'].addColumn('email', 'valid');
                    bm.command['cmd1'].addColumn('phone', ['bind','output']);

                    // console.log(bm.command['cmd1'].valid.columns['email']); // [Object HTMLColumn]
                    // console.log(bm.command['cmd1'].bind.columns['phone']);  // [Object HTMLColumn]
                    // console.log(bm.command['cmd1'].output.columns['phone']);// [Object HTMLColumn]                    

                    expect(bm.cmd['cmd1'].valid.cols['email'] instanceof HTMLColumn).toBe(T)
                    expect(bm.cmd['cmd1'].bind.cols['phone'] instanceof HTMLColumn).toBe(T)
                    expect(bm.cmd['cmd1'].output.cols['phone'] instanceof HTMLColumn).toBe(T)

                });
                it("- 사용자 정의 출력 뷰에 추가", () => {
                    const bm = new BindModel();
                    bm.addCommand('cmd1');

                    // 출력 뷰 추가
                    bm.command['cmd1'].newOutput('out2');

                    // 컬럼 추가 및 추가 출력 뷰에 참조 등록
                    bm.command['cmd1'].addColumn('address', 'out2');

                    // console.log(bm.command['cmd1'].out2.columns['address']); // [Object HTMLColumn]                    

                    expect(bm.cmd['cmd1'].out2.cols['address'] instanceof HTMLColumn).toBe(T)
                });
            });
            describe("addColumnValue()", () => {
                it("- 모든 뷰에 컬럼 추가", () => {
                    const bm = new BindModel();

                    // 명령 추가
                    bm.addCommand('cmd1');
                    
                    // 컬럼 초기값으로 등록
                    bm.command['cmd1'].addColumnValue('u_name', 'John', ['$all']);
                    
                    // console.log(bm.command['cmd1'].valid.columns['u_name'].value);  // Out: 'John'
                    // console.log(bm.command['cmd1'].bind.columns['u_name'].value);   // Out: 'John'
                    // console.log(bm.command['cmd1'].output.columns['u_name'].value); // Out: 'John'                    
                    
                    expect(bm.cmd['cmd1'].valid.cols['u_name'] instanceof HTMLColumn).toBe(T)
                    expect(bm.cmd['cmd1'].bind.cols['u_name'] instanceof HTMLColumn).toBe(T)
                    expect(bm.cmd['cmd1'].output.cols['u_name'] instanceof HTMLColumn).toBe(T)
                });
                it("- 특정 뷰에만 컬럼 등록", () => {
                    const bm = new BindModel();
                    bm.addCommand('cmd1');

                    // 컬럼 추가 및 뷰에 매핑
                    bm.command['cmd1'].addColumnValue('email', 'abc@gmail.com', 'valid');
                    bm.command['cmd1'].addColumnValue('phone', '12345', ['bind','output']);

                    // console.log(bm.cmd['cmd1'].valid.columns['email'].value); // Out: 'abc@gmail.com'
                    // console.log(bm.cmd['cmd1'].bind.columns['phone'].value);  // Out: 12345
                    // console.log(bm.cmd['cmd1'].output.columns['phone'].value);// Out: 12345                    
                    
                    expect(bm.cmd['cmd1'].valid.cols['email'] instanceof HTMLColumn).toBe(T)
                    expect(bm.cmd['cmd1'].bind.cols['phone'] instanceof HTMLColumn).toBe(T)
                    expect(bm.cmd['cmd1'].output.cols['phone'] instanceof HTMLColumn).toBe(T)
                });
                it("- 사용자 정의 출력 뷰에 추가 ", () => {
                    const bm = new BindModel();
                    bm.addCommand('cmd1');

                    // 출력 뷰 추가
                    bm.command['cmd1'].newOutput('out2');

                    // 컬럼 추가 및 뷰에 매핑
                    bm.command['cmd1'].addColumnValue('address', 'Home', 'out2');

                    // console.log(bm.command['cmd1'].out2.columns['address'].value); // Out: 'Home'                    
                    
                    expect(bm.cmd['cmd1'].out2.cols['address'].value).toBe('Home')
                });
            });
            describe("setColumn()", () => {
                it("- 단일 컬럼 설정", () => {
                    const bm = new BindModel();

                    // 명령 추가
                    bm.addCommand('cmd1');
                    bm.addCommand('cmd2');
                    bm.addCommand('cmd3');
                    
                    // 컬럼 추가
                    bm.columns.addValue('aa', 10);
                    bm.columns.addValue('bb', 20);
                    bm.columns.addValue('cc', 30);
                    
                    // 컬럼 참조 설정
                    bm.command['cmd1'].setColumn('aa', 'output');
                    
                    // console.log(bm.command['cmd1'].output.columns['aa'].value); // Out: 10
                    
                    expect(bm.cmd['cmd1'].output.cols['aa'].value).toBe(10)
                    
                    // 컬럼 참조 설정
                    bm.command['cmd2'].setColumn(['bb', 'cc'], ['valid', 'bind']);

                    // console.log(bm.command['cmd2'].valid.columns['bb'].value);  // Out: 20
                    // console.log(bm.command['cmd2'].bind.columns['cc'].value);   // Out: 30
                    // console.log(bm.command['cmd2'].valid.columns['bb'].value);  // Out: 20
                    // console.log(bm.command['cmd2'].bind.columns['cc'].value);   // Out: 30  
                    
                    expect(bm.cmd['cmd2'].valid.cols['bb'].value).toBe(20)
                    expect(bm.cmd['cmd2'].bind.cols['cc'].value).toBe(30)
                    expect(bm.cmd['cmd2'].valid.cols['bb'].value).toBe(20)
                    expect(bm.cmd['cmd2'].bind.cols['cc'].value).toBe(30)

                    // 컬럼 참조 설정
                    bm.command['cmd3'].setColumn('aa', '$all'); // views 기본값 : '$all'

                    // console.log(bm.command['cmd3'].valid.columns['aa'].value);  // Out: 10
                    // console.log(bm.command['cmd3'].bind.columns['aa'].value);   // Out: 10
                    // console.log(bm.command['cmd3'].output.columns['aa'].value); // Out: 10

                    expect(bm.cmd['cmd3'].valid.cols['aa'].value).toBe(10)
                    expect(bm.cmd['cmd3'].bind.cols['aa'].value).toBe(10)
                    expect(bm.cmd['cmd3'].output.cols['aa'].value).toBe(10)
                });
                it("- 테이블 설정 ", () => {
                    const bm = new BindModel();

                    // 명령 추가
                    bm.addCommand('cmd1');
                    
                    // 테이블 추가
                    bm.addTable('second');
                    
                    // 컬럼 추가
                    bm.columns.addValue('aa', 10); 
                    // 위와 동일
                    // bm.first.columns.addValue('aa', 10);
                    bm.second.columns.addValue('bb', 20);
                    
                    // 컬럼 참조 설정
                    bm.command['cmd1'].setColumn(['aa', 'second.bb'], 'valid');
                    
                    // console.log(bm.command['cmd1'].valid.columns['aa'].value); // Out: 10
                    // console.log(bm.command['cmd1'].valid.columns['bb'].value); // Out: 20
                    // bm.cmd['cmd1'].valid.columns['aa'] === bm.first.columns['aa']  // true
                    // bm.cmd['cmd1'].valid.columns['bb'] === bm.second.columns['bb'] // true  
                    
                    expect(bm.command['cmd1'].valid.columns['aa'].value).toBe(10)
                    expect(bm.command['cmd1'].valid.columns['bb'].value).toBe(20)
                    expect(bm.cmd['cmd1'].valid.cols['aa'] === bm.first.cols['aa']).toBe(T)
                    expect(bm.cmd['cmd1'].valid.cols['bb'] === bm.second.cols['bb']).toBe(T)
                });
            });
            describe("release()", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    // 명령 추가
                    bm.addCommand('cmd1');
                    
                    // 컬럼 추가
                    bm.columns.addValue('aa', 10);
                    
                    // 컬럼 매핑
                    bm.command['cmd1'].setColumn('aa', '$all');
                    
                    // console.log(bm.command['cmd1'].valid.columns['aa'].value);  // Out: 10
                    // console.log(bm.command['cmd1'].bind.columns['aa'].value);   // Out: 10
                    // console.log(bm.command['cmd1'].output.columns['aa'].value); // Out: 10
                    // console.log(bm.command['cmd1'].misc.columns['aa'].value);   // Out: 10  
                    
                    expect(bm.cmd['cmd1'].valid.cols['aa'].value).toBe(10)
                    expect(bm.cmd['cmd1'].bind.cols['aa'].value).toBe(10)
                    expect(bm.cmd['cmd1'].output.cols['aa'].value).toBe(10)
                    expect(bm.cmd['cmd1'].misc.cols['aa'].value).toBe(10)
                });
                it("- 일부 컬럼 해제", () => {
                    const bm = new BindModel();
                    bm.addCommand('cmd1');
                    bm.columns.addValue('aa', 10);
                    bm.command['cmd1'].setColumn('aa', '$all');

                    // 컬럼 해제
                    bm.command['cmd1'].release('aa', ['valid', 'bind']);

                    // console.log(bm.command['cmd1'].output.columns['aa'].value); // 10
                    
                    expect(bm.cmd['cmd1'].output.cols['aa'].value).toBe(10)
                });
                it("- 모든 컬럼 해제 ", () => {
                    const bm = new BindModel();
                    bm.addCommand('cmd1');
                    bm.columns.addValue('aa', 10);
                    bm.command['cmd1'].setColumn('aa', '$all');

                    // 컬럼 해제
                    bm.command['cmd1'].release('aa'); 
                    // 위와 동일
                    // bm.command['cmd1'].release('aa', '$all');

                    // console.log(bm.command['cmd1'].valid.columns.count);  // Out: 0
                    // console.log(bm.command['cmd1'].bind.columns.count);   // Out: 0
                    // console.log(bm.command['cmd1'].output.columns.count); // Out: 0
                    // console.log(bm.command['cmd1'].misc.columns.count);   // Out: 0
                    
                    expect(bm.cmd['cmd1'].valid.cols.count).toBe(0)
                    expect(bm.cmd['cmd1'].bind.cols.count).toBe(0)
                    expect(bm.cmd['cmd1'].output.cols.count).toBe(0)
                    expect(bm.cmd['cmd1'].misc.cols.count).toBe(0)
                });
            });
            describe("newOutput()", () => {
                it("- 기본뷰 뷰 추가", () => {
                    const bm = new BindModel();

                    // 명령 추가
                    bm.addCommand('cmd1');
                    
                    bm.command['cmd1'].output === bm.command['cmd1'].output1 // true
                    
                    expect(bm.command['cmd1'].output === bm.command['cmd1'].output1).toBe(T)
                });
                it("- 지정한 이름으로 뷰 추가 ", () => {
                    const bm = new BindModel();
                    bm.addCommand('cmd1');

                    // 출력 뷰 추가
                    bm.command['cmd1'].newOutput('info');

                    bm.cmd['cmd1'].ouput2 === bm.cmd['cmd1'].info  // true
                    console.log(bm.command['cmd1'].info);          // [Object MetaView]
                    console.log(bm.command['cmd1'].ouput2);        // [Object MetaView]

                    expect(bm.cmd['cmd1'].output2 === bm.cmd['cmd1'].info).toBe(T)
                    expect(bm.command['cmd1'].info instanceof MetaView).toBe(T)
                    expect(bm.command['cmd1'].info instanceof MetaView).toBe(T)
                });
                it("- 빈 이름으로 뷰 추가", () => {
                    const bm = new BindModel();
                    bm.addCommand('cmd1');

                    // 출력 뷰 추가
                    bm.command['cmd1'].newOutput();

                    console.log(); // [Object MetaView]
                    expect(bm.command['cmd1'].output2 instanceof MetaView).toBe(T)
                });
            });
            describe("removeOutput()", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    // 명령 추가
                    bm.addCommand('cmd1');
                    
                    // 출력 뷰 추가
                    bm.command['cmd1'].newOutput('customView');
                    
                    console.log(bm.command['cmd1'].customView); // [Object MetaView]
                    console.log(bm.command['cmd1'].output2);    // [Object MetaView]
                    
                    expect(bm.command['cmd1'].customView instanceof MetaView).toBe(T)
                    expect(bm.command['cmd1'].output2 instanceof MetaView).toBe(T)

                    // 출력 뷰 제거
                    bm.command['cmd1'].removeOutput('customView');
                    
                    console.log(bm.command['cmd1'].customView); // Out: undefined
                    console.log(bm.command['cmd1'].output2);    // Out: undefined
                    
                    expect(bm.command['cmd1'].customView).toBe(undefined)
                    expect(bm.command['cmd1'].output2).toBe(undefined)
                });
            });
            describe("onExecute", () => {
                it("- 예제", async () => {
                    const bm = new BindModel();

                    bm.addCommand('cmd1');
                    
                    // 이벤트 등록
                    bm.command['cmd1'].onExecute = function(model, cmd) {
                        console.log('Execute start...');
                    };
                    
                    await bm.command['cmd1'].execute();   
                    
                    expect(logSpy.mock.calls[0][0]).toBe('Execute start...')
                });
            });
            describe("onExecuted", () => {
                it("- 예제", async () => {
                    const bm = new BindModel();

                    bm.addCommand('cmd1');
                    
                    // 이벤트 등록
                    bm.command['cmd1'].onExecuted = function(model, cmd) {
                        console.log('Execute End...');
                    };
                    
                    await bm.command['cmd1'].execute();     
                    
                    expect(logSpy.mock.calls[0][0]).toBe('Execute End...')
                    
                });
            });
        });
        describe("MetaView 클래스", () => {
            describe("_baseEntity", () => {
                it("- 전체 참조 ", () => {
                    const table1 = new MetaTable('t1');
                    const view1 = new MetaView('v1');
                    
                    // 기본 엔티티 설정
                    view1._baseEntity = table1;
                    
                    view1.columns.add('u_id');
                    view1.columns.add('addr');
                    
                    view1.columns['u_id'] === table1.columns['u_id'] // true
                    view1.columns['addr'] === table1.columns['addr'] // true   
                    
                    expect(view1.cols['u_id'] === table1.cols['u_id']).toBe(T)
                    expect(view1.cols['addr'] === table1.cols['addr']).toBe(T)
                });
                it("- 특정 컬럼만 참조", () => {
                    const table1 = new MetaTable('t1');
                    const view1 = new MetaView('v1');
                    
                    view1.columns.add('u_id', table1.columns);  // 컬럼 추가 시 컬렉션 지정
                    view1.columns.add('addr');
                    
                    view1.columns['u_id'] === table1.columns['name'] // true
                    console.log(view1.columns['addr']);                     // [Object MetaColumn]  
                    
                    expect(view1.cols['u_id'] === table1.cols['u_id']).toBe(T)
                    expect(view1.columns['addr'] instanceof MetaColumn).toBe(T)
                });
                it("- 독립 사용 ", () => {
                    const view1 = new MetaView('v1');

                    view1.columns.addValue('addr', 'USA');
                    
                    console.log(view1.columns['addr'].value); // Out: 'USA'    
                    
                    expect(view1.columns['addr'].value).toBe('USA')
                });
            });
            describe("viewName", () => {
                it("- 예제", () => {
                    const view1 = new MetaView('v1');

                    console.log(view1.viewName); // Out: 'v1'
                    console.log(view1._name);    // Out: 'v1'
                    
                    expect(view1.viewName).toBe('v1')
                    expect(view1._name).toBe('v1')

                    view1.viewName = 'v2';  // 이름 변경
                    
                    console.log(view1.viewName); // Out: 'v2'
                    console.log(view1._name);    // Out: 'v2'
                    
                    expect(view1.viewName).toBe('v2')
                    expect(view1._name).toBe('v2')
                });
            });
            describe("columns", () => {
                it("- 컬럼 추가", () => {
                    const view1 = new MetaView('v1');

                    // 빈 컬럼 추가
                    view1.columns.add('u_id');
                    
                    // 초기값이 있는 컬럼 추가
                    view1.columns.addValue('addr', 'USA');
                    
                    console.log(view1.columns['u_id']);         // [Object MetaColumn]
                    console.log(view1.columns['addr'].value);   // 'USA'          
                    
                    expect(view1.columns['u_id'] instanceof MetaColumn).toBe(T)
                    expect(view1.columns['addr'].value).toBe('USA')
                });
                it("- BindModel 에서 컬럼 추가", () => {
                    const bm = new BindModel();

                    // 기본 컬렉션에서 컬럼 추가
                    bm.columns.add('gender');
                    bm.columns.addValue('addr', 'USA');
                    
                    // 모델에서 컬럼 추가
                    bm.addColumn('memo');
                    bm.addColumnValue('age', 20);
                    
                    console.log(bm.columns['gender']);       // [Object MetaColumn]
                    console.log(bm.columns['addr'].value);   // Out: 'USA'
                    console.log(bm.columns['memo']);         // [Object MetaColumn]
                    console.log(bm.columns['age'].value);    // Out: 20    
                    
                    expect(bm.columns['gender'] instanceof MetaColumn).toBe(T)
                    expect(bm.columns['addr'].value).toBe('USA')
                    expect(bm.columns['memo'] instanceof MetaColumn).toBe(T)
                    expect(bm.columns['age'].value).toBe(20)
                    
                });
                it("- 컬럼 참조 사용", () => {
                    const table1 = new MetaTable('t1');
                    const view1 = new MetaView('v1');
                    
                    view1.columns.add('u_name', table1.columns);  // 컬럼 추가 시 컬렉션 지정
                    view1.columns.add('addr');
                    
                    view1.columns['u_name'] === table1.columns['u_name'] // true
                    console.log(view1.columns['addr']);                  // [Object MetaColumn]

                    expect(view1.columns['u_name'] === table1.columns['u_name']).toBe(T)
                    expect(view1.columns['addr'] instanceof MetaColumn).toBe(T)
                });
            });
            describe("rows", () => {
                it("- 예제", () => {
                    const view1 = new MetaView('v1');

                    // 컬럼 추가
                    view1.columns.add('u_name');
                    view1.columns.add('age');
                    
                    // 행 추가
                    const row = view1.newRow();
                    row['u_name'] = 'John';
                    row['age'] = 20;
                    view1.rows.add(row);
                    
                    console.log(view1.rows[0]['u_name']); // Out: 'John'
                    console.log(view1.rows[0]['age']);    // Out: 20      
                    
                    expect(view1.rows[0]['u_name']).toBe('John')
                    expect(view1.rows[0]['age']).toBe(20)
                    
                });
            });
            describe("clone()", () => {
                it("- 예제", () => {
                    const view1 = new MetaView('v1');

                    view1.columns.addValue('age', 20);
                    
                    // 뷰 복제
                    const clone = view1.clone();
                    
                    console.log(clone.viewName);  // Out: 'v1'
                    clone.columns['age'] === view1.columns['age']             // false
                    clone.columns['age'].value === view1.columns['age'].value // true 
                    
                    expect(clone.viewName).toBe('v1')
                    expect(clone.columns['age'] === view1.columns['age']).toBe(false)
                    expect(clone.columns['age'].value === view1.columns['age'].value).toBe(T)
                });
            });
            describe("copy()", () => {
                it("- 예제", () => {
                    const view1 = new MetaView('view1');

                    // 컬럼 추가
                    view1.columns.add('c1');
                    view1.columns.add('c2');
                    view1.columns.add('c3');
                    
                    // 행 추가 
                    view1.rows.add(view1.newRow());
                    view1.rows[0]['c1'] = 1;
                    view1.rows[0]['c2'] = 2;
                    view1.rows[0]['c3'] = 3;
                    view1.rows.add(view1.newRow());
                    view1.rows[1]['c1'] = 10;
                    view1.rows[1]['c2'] = 20;
                    view1.rows[1]['c3'] = 30;
                    
                    // 첫번째 복사
                    const copy1 = view1.copy(row => row['c1'] < 10, ['c1']);
                    
                    console.log(copy1.rows.count);    // Out: 1
                    console.log(copy1.rows[0]['c1']); // Out: 1
                    
                    expect(copy1.rows.count).toBe(1)
                    expect(copy1.rows[0]['c1']).toBe(1)
                    
                    // 두번째 복사
                    const copy2 = view1.copy(['c1', 'c2']);
                    
                    console.log(copy2.rows[0]['c1']); // Out: 1
                    console.log(copy2.rows[0]['c2']); // Out: 2
                    console.log(copy2.rows[1]['c1']); // Out: 10
                    console.log(copy2.rows[1]['c2']); // Out: 20    
                    
                    expect(copy2.rows[0]['c1']).toBe(1)
                    expect(copy2.rows[0]['c2']).toBe(2)
                    expect(copy2.rows[1]['c1']).toBe(10)
                    expect(copy2.rows[1]['c2']).toBe(20)
                    
                });
            });
            describe("clear()", () => {
                it("- 예제", () => {
                    const view = new MetaView('v1');

                    // 컬럼 추가
                    view.columns.add('age');
                    view.columns.add('u_name');
                    
                    // 데이터(행) 추가
                    view.rows.add(view.newRow());
                    view.rows[0].age = 10;
                    view.rows[0].u_name = 'Alice';
                    view.rows.add(view.newRow());
                    view.rows[1].age = 20;
                    view.rows[1].u_name = 'Bob';
                    
                    console.log(view.rows.count);    // Out: 2

                    expect(view.rows.count).toBe(2)
                    
                    // 데이터 초기화
                    view.clear();
                    
                    console.log(view.rows.count);    // Out: 0
                    console.log(view.columns.count); // Out: 2     
                    
                    expect(view.rows.count).toBe(0)
                    expect(view.columns.count).toBe(2)
                });
            });
            describe("reset()", () => {
                it("- 예제", () => {
                    const view = new MetaView('v1');

                    // 컬럼 추가
                    view.columns.add('age');
                    view.columns.add('u_name');
                    
                    // 데이터(행) 추가
                    view.rows.add(view.newRow());
                    view.rows[0].age = 10;
                    view.rows[0].u_name = 'Alice';
                    
                    // 전체 초기화
                    view.reset();
                    
                    console.log(view.viewName);      // Out: 'v1'
                    console.log(view.rows.count);    // Out: 0
                    console.log(view.columns.count); // Out: 0     
                    
                    expect(view.viewName).toBe('v1')
                    expect(view.rows.count).toBe(0)
                    expect(view.columns.count).toBe(0)
                });
            });
            describe("newRow()", () => {
                it("- 예제", () => {
                    const view = new MetaView('v1');

                    // 컬럼 추가
                    view.columns.add('id');
                    view.columns.add('name');
                    
                    // 데이터(행) 추가
                    const row = view.newRow();
                    row['age'] = 20;
                    row['u_name'] = 'Alice';
                    view.rows.add(row);
                    
                    console.log(view.rows[0]['age']);    // Out: 20
                    console.log(view.rows[0]['u_name']); // Out: 'Alice'  
                    
                    expect(view.rows[0]['age']).toBe(20)
                    expect(view.rows[0]['u_name']).toBe('Alice')
                });
            });
            describe("getValue()", () => {
                it("- 예제", () => {
                    const view = new MetaView('v1');

                    // 컬럼 추가
                    view.columns.addValue('age', 20);
                    view.columns.add('u_name');
                    
                    const row = view.getValue();
                    
                    console.log(row['age']);    // Out: 20
                    console.log(row['u_name']); // Out: ''    
                    
                    expect(row['age']).toBe(20)
                    expect(row['u_name']).toBe('')
                });
            });
            describe("setValue()", () => {
                it("- 예제", () => {
                    const view = new MetaView('v1');

                    // 컬럼 추가
                    view.columns.add('age');
                    view.columns.add('u_name');
                    view.columns['u_name'].alias = 'r_name';  // 별칭 설정
                    
                    // 행 생성
                    const row = view.newRow();
                    row['age'] = 20;
                    row['r_name'] = 'Alice';
                    
                    // 컬럼값 설정
                    view.setValue(row);
                    
                    // 행 추가
                    view.rows.add(row);
                    
                    console.log(view.columns['age'].value);    // Out: 20
                    console.log(view.columns['u_name'].value); // Out: 'Alice'
                    console.log(view.rows[0]['age']);          // Out: 20
                    console.log(view.rows[0]['r_name']);       // Out: 'Alice'   
                    
                    expect(view.columns['age'].value).toBe(20)
                    expect(view.columns['u_name'].value).toBe('Alice')
                    expect(view.rows[0]['age']).toBe(20)
                    expect(view.rows[0]['r_name']).toBe('Alice')
                });
            });
            describe("merge()", () => {
                it("- 컬럼 매칭 : 0", () => {
                    const view1 = new MetaView('v1');
                    const view2 = new MetaView('v2');
                    
                    // 데이터 행(row) 읽기 : read opt = 3
                    view1.read({ rows: [{ c1: 'R1', c2: 'R2' }] }, 3);
                    view2.read({ rows: [{ c1: 'R10', c2: 'R20' }] }, 3);
                    
                    // 병합 opt = 0
                    view1.merge(view2, 0);
                    
                    console.log(view1.columns.count); // Out: 2
                    console.log(view1.rows.count);    // Out: 2
                    console.log(view1.rows[0]['c1']); // Out: 'R1'
                    console.log(view1.rows[0]['c2']); // Out: 'R2'
                    console.log(view1.rows[1]['c1']); // Out: 'R10'
                    console.log(view1.rows[1]['c2']); // Out: 'R20'         
                    
                    expect(view1.columns.count).toBe(2)
                    expect(view1.rows.count).toBe(2)
                    expect(view1.rows[0]['c1']).toBe('R1')
                    expect(view1.rows[0]['c2']).toBe('R2')
                    expect(view1.rows[1]['c1']).toBe('R10')
                    expect(view1.rows[1]['c2']).toBe('R20')
                });
                it("- 컬럼 일부 매칭 : 0", () => {
                    const view1 = new MetaView('v1');
                    const view2 = new MetaView('v2');
                    
                    // 데이터 행(row) 읽기 : read opt = 3
                    view1.read({ rows: [{ c1: 'R1', c2: 'R2' }] }, 3);
                    view2.read({ rows: [{ c1: 'R10', c3: 'R30' }] }, 3);
                    
                    // 병합 opt = 0
                    view1.merge(view2, 0);
                    
                    console.log(view1.columns.count); // Out: 2
                    console.log(view1.rows.count);    // Out: 2
                    console.log(view1.rows[0]['c1']); // Out: 'R1'
                    console.log(view1.rows[0]['c2']); // Out: 'R2'
                    console.log(view1.rows[1]['c1']); // Out: 'R10'
                    console.log(view1.rows[1]['c2']); // Out: ''  
                    
                    expect(view1.columns.count).toBe(2)
                    expect(view1.rows.count).toBe(2)
                    expect(view1.rows[0]['c1']).toBe('R1')
                    expect(view1.rows[0]['c2']).toBe('R2')
                    expect(view1.rows[1]['c1']).toBe('R10')
                    expect(view1.rows[1]['c2']).toBe('')
                });
                it("- 컬럼 전부 비매칭 : 1", () => {
                    const view1 = new MetaView('v1');
                    const view2 = new MetaView('v2');
                    
                    // 데이터 행(row) 읽기 : read opt = 3
                    view1.read({ rows: [{ c1: 'R1', c2: 'R2' }] }, 3);
                    view2.read({ rows: [{ c3: 'R3', c4: 'R4' }, { c3: 'R30', c4: 'R40' }] }, 3);
                    
                    // 병합 opt = 1
                    view1.merge(view2, 1);
                    
                    console.log(view1.columns.count); // Out: 4
                    console.log(view1.rows.count);    // Out: 1
                    console.log(view1.rows[0]['c1']); // Out: 'R1'
                    console.log(view1.rows[0]['c2']); // Out: 'R2'
                    console.log(view1.rows[0]['c3']); // Out: 'R3'
                    console.log(view1.rows[0]['c4']); // Out: 'R4'        
                    
                    expect(view1.columns.count).toBe(4)
                    expect(view1.rows.count).toBe(1)
                    expect(view1.rows[0]['c1']).toBe('R1')
                    expect(view1.rows[0]['c2']).toBe('R2')
                    expect(view1.rows[0]['c3']).toBe('R3')
                    expect(view1.rows[0]['c4']).toBe('R4')
                });
                it("- 컬럼 일부 매칭 : 2", () => {
                    const view1 = new MetaView('view1');
                    const view2 = new MetaView('view2');
                    
                    // 데이터 행(row) 읽기
                    view1.read({ rows: [{ c1: 'R1', c2: 'R2' }] }, 3);
                    view2.read({ rows: [{ c1: 'R10', c3: 'R30' }] }, 3);
                    
                    // 병합 opt = 2
                    view1.merge(view2, 2);
                    
                    console.log(view1.columns.count); // Out: 3
                    console.log(view1.rows.count);    // Out: 2
                    console.log(view1.rows[0]['c1']); // Out: 'R1'
                    console.log(view1.rows[0]['c2']); // Out: 'R2'
                    console.log(view1.rows[0]['c3']); // Out: ''
                    console.log(view1.rows[1]['c1']); // Out: 'R10'
                    console.log(view1.rows[1]['c2']); // Out: ''
                    console.log(view1.rows[1]['c3']); // Out: 'R30'  
                    
                    expect(view1.columns.count).toBe(3)
                    expect(view1.rows.count).toBe(2)
                    expect(view1.rows[0]['c1']).toBe('R1')
                    expect(view1.rows[0]['c2']).toBe('R2')
                    expect(view1.rows[0]['c3']).toBe('')
                    expect(view1.rows[1]['c1']).toBe('R10')
                    expect(view1.rows[1]['c2']).toBe('')
                    expect(view1.rows[1]['c3']).toBe('R30')
                });
                it("- 컬럼 전부 비매칭 : 3", () => {
                    const view1 = new MetaView('view1');
                    const view2 = new MetaView('view2');
                    
                    // 데이터 행(row) 읽기
                    view1.read({ rows: [{ c1: 'R1', c2: 'R2' }] }, 3);
                    view2.read({ rows: [{ c3: 'R3', c4: 'R4' }, { c3: 'R30', c4: 'R40' }] }, 3);
                    
                    // 병합 opt = 3
                    view1.merge(view2, 3);
                    
                    console.log(view1.columns.count); // Out: 4
                    console.log(view1.rows.count);    // Out: 2
                    console.log(view1.rows[0]['c1']); // Out: 'R1'
                    console.log(view1.rows[0]['c2']); // Out: 'R2'
                    console.log(view1.rows[0]['c3']); // Out: 'R3'
                    console.log(view1.rows[0]['c4']); // Out: 'R4'
                    console.log(view1.rows[1]['c1']); // Out: ''
                    console.log(view1.rows[1]['c2']); // Out: ''
                    console.log(view1.rows[1]['c3']); // Out: 'R30'
                    console.log(view1.rows[1]['c4']); // Out: 'R40'     
                    
                    expect(view1.columns.count).toBe(4)
                    expect(view1.rows.count).toBe(2)
                    expect(view1.rows[0]['c1']).toBe('R1')
                    expect(view1.rows[0]['c2']).toBe('R2')
                    expect(view1.rows[0]['c3']).toBe('R3')
                    expect(view1.rows[0]['c4']).toBe('R4')
                    expect(view1.rows[1]['c1']).toBe('')
                    expect(view1.rows[1]['c2']).toBe('')
                    expect(view1.rows[1]['c3']).toBe('R30')
                    expect(view1.rows[1]['c4']).toBe('R40')
                });
            });
            describe("select()", () => {
                it("- 필터 함수로 데이터 선택", () => {
                    const view1 = new MetaView('v1');

                    // 데이터 행(row) 읽기
                    view1.read({ rows: [{ c1: 10, c2: 'R2' }, { c1: 20, c2: 'R20' }]}, 3);
                    
                    // rows 선택
                    const rows = view1.select(row => row['c1'] > 10);
                    
                    console.log(rows.length);   // Out: 1
                    console.log(rows[0]['c1']); // Out: 20
                    console.log(rows[0]['c2']); // Out: 'R20'     
                    
                    expect(rows.length).toBe(1)
                    expect(rows[0]['c1']).toBe(20)
                    expect(rows[0]['c2']).toBe('R20')
                });
                it("- 특정 컬럼 선택 ", () => {
                    const view1 = new MetaView('V1');

                    // 데이터 행(row) 읽기
                    view1.read({ rows: [{ c1: 10, c2: 'R2' }, { c1: 20, c2: 'R20' }]}, 3);
                    
                    // rows 선택
                    const rows = view1.select(['c1']);
                    
                    console.log(rows.length);   // Out: 2
                    console.log(rows[0]['c1']); // Out: 10
                    console.log(rows[1]['c1']); // Out: 20      
                    
                    expect(rows.length).toBe(2)
                    expect(rows[0]['c1']).toBe(10)
                    expect(rows[1]['c1']).toBe(20)
                });
            });
            describe("output()", () => {
                it("- 예제", () => {
                    const view1 = new MetaView('v1');
                    const view2 = new MetaView('v2');
                    
                    // 컬럼 추가
                    view1.columns.addValue('c1', 10);
                    
                    // 문자열로 내보내기 : opt = 0
                    const data1 = view1.output(); 
                    
                    // 문자열로 가져오기
                    view2.load(data1);
                    
                    console.log(view1.viewName);            // Out: 'v1'
                    console.log(view1.columns['c1'].value); // Out: 10
                    console.log(view2.viewName);            // Out: 'v1'
                    console.log(view2.columns['c1'].value); // Out: 10      
                    
                    expect(view1.viewName).toBe('v1')
                    expect(view1.columns['c1'].value).toBe(10)
                    expect(view2.viewName).toBe('v1')
                    expect(view2.columns['c1'].value).toBe(10)
                });
            });
            describe("load()", () => {
                it("- 예제", () => {
                    const view1 = new MetaView('v1');
                    const view2 = new MetaView('v2');
                    const view3 = new MetaView('v3');
                    
                    // 컬럼 추가
                    view1.columns.addValue('c1', 10);
                    
                    // 문자열로 내보내기
                    const data1 = view1.output();
                    // 객체로 내보내기
                    const data2 = view1.getObject();
                    
                    // 문자열 불러오기
                    view2.load(data1);
                    // 객체 불러오기
                    view3.load(data2);
                    
                    console.log(view1.viewName); // Out: 'v1'
                    console.log(view2.viewName); // Out: 'v1'
                    console.log(view3.viewName); // Out: 'v1'
                    console.log(view1.columns['c1'].value); // Out: 10
                    console.log(view2.columns['c1'].value); // Out: 10
                    console.log(view3.columns['c1'].value); // Out: 10       
                    
                    expect(view1.viewName).toBe('v1')
                    expect(view2.viewName).toBe('v1')
                    expect(view3.viewName).toBe('v1')
                    expect(view1.columns['c1'].value).toBe(10)
                    expect(view2.columns['c1'].value).toBe(10)
                    expect(view3.columns['c1'].value).toBe(10)
                });
            });
            describe("write()", () => {
                it("- 예제", () => {
                    const view = new MetaView('v1');
                    const c1 = new HTMLColumn('u_id', view, { default: 0, required: true });
                    const c2 = new HTMLColumn('name', view, { caption: 'Full Name' });

                    // 컬럼 추가
                    view.columns.add(c1);
                    view.columns.add(c2);

                    // 행 추가
                    view.rows.add(view.newRow());
                    view.rows[0]['u_id'] = 1;
                    view.rows[0]['name'] = 'Alice';
                    view.rows.add(view.newRow());
                    view.rows[1]['u_id'] = 2;
                    view.rows[1]['name'] = 'Bob';
                    
                    // MetaView 스키마 쓰기 : opt = 2
                    const schema = view.write(2);
                    console.log(schema);
                    // Out: 
                    // {
                    //      "columns": {
                    //          "u_id": {
                    //              "default": 0,
                    //              "required": true
                    //          },
                    //          "name": {
                    //              "default": "",
                    //              "caption": "Full Name"
                    //          }
                    //          "$key": ["u_id", "name"]
                    //      },
                    //      "rows": [
                    //          { "u_id": 1, "name": "Alice" },
                    //          { "u_id": 2, "name": "Bob" }
                    //      ]
                    // } 
                    
                    expect(schema).toEqual({
                        "columns": {
                            "u_id": {
                                "default": 0,
                                "required": true
                            },
                            "name": {
                                "caption": "Full Name"
                            },
                            "$key": ["u_id", "name"]
                        },
                        "rows": [
                            { "u_id": 1, "name": "Alice" },
                            { "u_id": 2, "name": "Bob" }
                        ]
                    });
                });
            });
            describe("writeSchema()", () => {
                it("- 예제", () => {
                    const view = new MetaView('v1');
                    const c1 = new HTMLColumn('u_id', view, { default: 0, required: true });
                    const c2 = new HTMLColumn('name', view, { caption: 'Full Name' });

                    // 컬럼 추가
                    view.columns.add(c1);
                    view.columns.add(c2);

                    // 행 추가
                    view.rows.add(view.newRow());
                    view.rows[0]['u_id'] = 1;
                    view.rows[0]['name'] = 'Alice';
                    
                    // MetaView 스키마 쓰기 : opt = 2
                    const schema = view.writeSchema(2);
                    console.log(schema);
                    // Out: 
                    // {
                    //      "columns": {
                    //          "u_id": {
                    //              "default": 0,
                    //              "required": true
                    //          },
                    //          "name": {
                    //              "caption": "Full Name"
                    //          }
                    //          "$key": ["u_id", "name"]
                    //      }
                    // } 
                    
                    expect(schema).toEqual({
                        "columns": {
                            "u_id": {
                                "default": 0,
                                "required": true
                            },
                            "name": {
                                "caption": "Full Name"
                            },
                            "$key": ["u_id", "name"]
                        }
                    });
                });
            });
            describe("writeData()", () => {
                it("- 예제", () => {
                    const view = new MetaView('v1');

                    // 컬럼 추가
                    view.columns.add('u_id');
                    view.columns.add('name');
                    
                    view.rows.add(view.newRow());
                    view.rows[0]['u_id'] = 1;
                    view.rows[0]['name'] = 'Alice';
                    view.rows.add(view.newRow());
                    view.rows[1]['u_id'] = 2;
                    view.rows[1]['name'] = 'Bob';
                    
                    // 데이터 쓰기 : opt = 2
                    const data = view.writeData(2);
                    
                    console.log(data);
                    // Out:
                    // {
                    //     "rows": [
                    //         { "u_id": 1, "name": "Alice" },
                    //         { "u_id": 2, "name": "Bob" }
                    //     ]
                    // }            
                    
                    expect(data).toEqual({
                        "rows": [
                            { "u_id": 1, "name": "Alice" },
                            { "u_id": 2, "name": "Bob" }
                        ]
                    }) 
                });
            });
            describe("read()", () => {
                it("- MetaView 객체에서 읽기", () => {
                    const view1 = new MetaView('v1');
                    const view2 = new MetaView('v2', view1); // 전체 참조 뷰
                    const view3 = new MetaView('v3');
                    
                    // 컬럼 추가
                    view1.columns.add('c1');
                    view2.columns.add('c2');
                    view3.columns.add('c3', view2.columns); // 컬럼 일부 참조
                    
                    // 스키마를 읽을 뷰 생성
                    const v1 = new MetaView('view1');
                    const v2 = new MetaView('view2');
                    const v3 = new MetaView('view3');
                    
                    // 컬럼 및 데이터 읽기 : opt = 3
                    v1.read(view1);
                    v2.read(view2);
                    v3.read(view3);
                    
                    console.log(v1.columns.count); // Out: 3
                    console.log(v2.columns.count); // Out: 2
                    console.log(v3.columns.count); // Out: 1
                    
                    expect(v1.columns.count).toBe(3)
                    expect(v2.columns.count).toBe(2)
                    expect(v3.columns.count).toBe(1)
                });
                it("- 스키마 객체 읽기 ", () => {
                    const view = new MetaView('v1');
                    const schema = {
                        columns: { c1: 'D1', c2: 'D2'},
                        rows: [{ c1: 'R1', c2: 'R2' }]
                    };
                    
                    // 컬럼 및 데이터 읽기 : opt = 3
                    view.read(schema);
                    
                    console.log(view.columns.count); // Out: 2
                    console.log(view.rows.count);    // Out: 1  
                    
                    expect(view.columns.count).toBe(2)
                    expect(view.rows.count).toBe(1)
                });
            });
            describe("readSchema()", () => {
                it("- 컬럼 정보 읽기", () => {
                    const view = new MetaView('v1');
                    const schema = {
                        columns: { c1: 'D1', c2: 'D2' }
                    };
                    
                    // 컬럼 읽기
                    view.readSchema(schema);
                    
                    console.log(view.columns.count);       // Out: 2
                    console.log(view.columns['c1'].value); // Out: 'D1'
                    console.log(view.columns['c2'].value); // Out: 'D2'   
                    
                    expect(view.columns.count).toBe(2)
                    expect(view.columns['c1'].value).toBe('D1')
                    expect(view.columns['c2'].value).toBe('D2')
                });
                it("- 읽기 순서 변경", () => {
                    const view = new MetaView('t1');
                    const schema = {
                        columns: {
                            $key: ['c2', 'c1'],  // 키 위치 변경
                            c1: { caption: 'Column1' }, 
                            c2: { caption: 'Column2' }
                        }
                    };
                    
                    view.readSchema(schema);
                    
                    console.log(view.columns.count);  // Out: 2
                    console.log(view.columns['c2'].caption); // Out: 'Column2'
                    console.log(view.columns['c1'].caption); // Out: 'Column1'
                    console.log(view.columns[0].caption); // Out: 'Column2'
                    console.log(view.columns[1].caption); // Out: 'Column1'

                    expect(view.columns.count).toBe(2)
                    expect(view.columns['c1'].caption).toBe('Column1')
                    expect(view.columns['c2'].caption).toBe('Column2')
                    expect(view.columns[0].caption).toBe('Column2')
                    expect(view.columns[1].caption).toBe('Column1')
                });
            });
            describe("readData()", () => {
                it("- 행 데이터 읽기", () => {
                    const view = new MetaView('v1');
                    const schema = {
                        columns: { c1: 'D1', c2: 'D2' }
                    };
                    
                    // 컬럼 읽기
                    view.readSchema(schema);
                    
                    console.log(view.columns.count);       // Out: 2
                    console.log(view.columns['c1'].value); // Out: 'D1'
                    console.log(view.columns['c2'].value); // Out: 'D2'
                    
                    expect(view.columns.count).toBe(2)
                    expect(view.columns['c1'].value).toBe('D1')
                    expect(view.columns['c2'].value).toBe('D2')
                });
                it("- 컬럼없는 데이터 읽기", () => {
                    const view = new MetaView('t1');
                    const schema = {
                        columns: {
                            $key: ['c2', 'c1'],  // 키 위치 변경
                            c1: { caption: 'Column1' }, 
                            c2: { caption: 'Column2' }
                        }
                    };
                    
                    view.readSchema(schema);
                    
                    console.log(view.columns.count);  // Out: 2
                    console.log(view.columns['c2'].caption); // Out: 'Column2'
                    console.log(view.columns['c1'].caption); // Out: 'Column1'
                    console.log(view.columns[0].caption); // Out: 'Column2'
                    console.log(view.columns[1].caption); // Out: 'Column1'  
                    
                    expect(view.columns.count).toBe(2)
                    expect(view.columns['c2'].caption).toBe('Column2')
                    expect(view.columns['c1'].caption).toBe('Column1')
                    expect(view.columns[0].caption).toBe('Column2')
                    expect(view.columns[1].caption).toBe('Column1')
                });
            });
        });
        describe.skip("HTMLColumn 클래스", () => {
            describe("_valueTypes", () => {
                it("- 예제", () => {
                    const c1 = new HTMLColumn('aa');

                    // 타입 재정의
                    c1._valueTypes = [String];
                    
                    c1.value = 'Mike';     // 값 등록 성공
                    expect(() => { c1.value = 10 }).toThrow(); // 제약조건으로 예외 발생!!
                    expect(() => { c1.default = 10 }).toThrow(); // 제약조건으로 예외 발생!!

                    console.log(c1._valueTypes); // Out: [String]

                    expect(c1._valueTypes).toEqual([String])
                });
            });
            describe("_entity", () => {
                it("- 예제", () => {
                    const table = new MetaView('users');

                    table.columns.add('name');
                    
                    console.log(table.columns['name']._entity.viewName); // Out: 'users'
                    expect(table.columns['name']._entity.viewName).toBe('users');
                });
            });
            describe("value", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('age');

                    // 기본값 설정
                    column.default = 15;
                    
                    // getter / setter 정의
                    column.getter = () => column.default * 2;
                    column.setter = (val) => { if (val > 0) column.default = val; };
                    
                    console.log(column.value); // Out: 30 (getter를 통해 값 조회)
                    expect(column.value).toBe(30);
                    
                    column.value = 30;         // setter를 통해 값 설정
                    console.log(column.value); // Out: 60 (getter를 통해 값 조회)
                    expect(column.value).toBe(60);
                });
            });
            describe("default", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('status');

                    // 기본값 설정
                    column.default = 'active';
                    
                    // 값 설정 후 확인
                    column.value = 'inactive';
                    console.log(column.value);  // Out: 'inactive'
                    expect(column.value).toBe('inactive');
                    
                    // 기본값 반환
                    column.value = null;
                    console.log(column.value);  // Out: 'active'
                    expect(column.value).toBe('active');
                });
            });
            describe("getter", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('price');

                    // getter 정의
                    column.getter = () => {
                        return column.default + 50;
                    };
                    
                    // 기본값 설정
                    column.default = 100;
                    
                    // 값 조회
                    console.log(column.value); // Out: 150
                    expect(column.value).toBe(150);
                });
            });
            describe("setter", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('discount');

                    // setter 설정
                    column.setter = (value) => {
                        if (typeof value !== 'number' || value < 0 || value > 100) {
                            throw new Error('Discount must be a number from 0 to 100.');
                        }
                        return value;  // 내부에 저장됨
                    };
                    
                    // 값 설정
                    column.value = 20;
                    console.log(column.value); // Out: 20
                    expect(column.value).toBe(20);
                    
                    try {
                        column.value = 150;   // 유효성 검사 실패!!
                    } catch (e) {
                        console.error(e.message); // Out: 'Discount must be a number from 0 to 100.'
                        expect(e.message).toBe('Discount must be a number from 0 to 100.');
                    }
                });
            });
            describe("getFilter", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('price');

                    // getFilter 설정
                    column.getFilter = (selectorValue) => {
                        return `$${selectorValue.toFixed(2)}`;
                    };
                    
                    // selector 설정
                    column.selector = { key: '#price-input', type: 'value' };
                    // DOM 에 값 입력
                    document.querySelector('#price-input').value = 123.456;
                    
                    console.log(column.value); // Out: '$123.45'
                    expect(column.value).toBe('$123.45');
                });
            });
            describe("setFilter", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('price');

                    // setFilter 설정
                    column.setFilter = (innerValue) => {
                        return `$${innerValue.toFixed(2)}`; // 통화 형식으로 변환
                    };
                    
                    // selector 설정
                    column.selector = { key: '#price-input', type: 'value' };
                    
                    // 값 설정
                    column.value = 123.456;
                    console.log(document.querySelector('#price-input').value); // Out: '$123.45'
                    expect(document.querySelector('#price-input').value).toBe('$123.45');
                });
            });
            describe("selector", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('status');

                    // selector 설정
                    column.selector = { key: '#status-input', type: 'value' };
                    
                    // 값 설정
                    column.value = 'Active'; // HTML 요소의 값이 업데이트됨
                    console.log(document.querySelector('#status-input').value); // Out: 'Active'
                    expect(document.querySelector('#status-input').value).toBe('Active');
                    
                    // DOM 값 입력
                    document.querySelector('#status-input').value = 'Inactive';
                    console.log(column.value); // Out: 'Inactive'
                    expect(column.value).toBe('Inactive');
                });
            });
            describe("required", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('username');

                    // 필수 설정
                    column.required = true;
                    
                    // 유효성 검사
                    if (!column.valid(column.value)) {
                        console.error('Value is required for username.');
                        expect(column.valid(column.value)).toBe(false);
                    } else {
                        console.log('Value is valid.');
                        expect(column.valid(column.value)).toBe(true);
                    }
                });
            });
            describe("constraints", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('email');
                    let check;
                    
                    // constraints 설정
                    column.constraints = [
                        { regex: /^[^@]+@[^@]+\.[^@]+$/, msg: 'Invalid email format.' },
                        (value) => value.length > 3
                    ];
                    
                    // 값 설정 및 유효성 검사
                    column.value = 'example@example.com';
                    check = column.valid(column.value);
                    if (check) {
                        console.error(check.msg);
                        expect(check.msg).toBeUndefined();
                    }
                    
                    column.value = 'a@b';
                    check = column.valid(column.value);
                    if (check) {
                        console.error(check.msg); // Out: 'function constraint failed.'
                        expect(check.msg).toBe('function constraint failed.');
                    }
                    
                    column.value = 'invalid-email';
                    check = column.valid(column.value);
                    if (check) {
                        console.error(check.msg); // Out: 'Invalid email format.'
                        expect(check.msg).toBe('Invalid email format.');
                    }
                });
            });
            describe("columnName", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('username');

                    console.log(column.columnName); // Out: 'username'
                    console.log(column._name);      // Out: 'username'
                    expect(column.columnName).toBe('username');
                    expect(column._name).toBe('username');
                });
            });
            describe("alias", () => {
                it("- 예제", () => {
                    const view = new MetaView('userView');

                    // 컬럼 추가 및 별칭 설정
                    view.columns.add('u_name', { alias: 'user_name' });
                    
                    let row = view.newRow();
                    row['user_name'] = 'John';
                    view.rows.add(row);
                    
                    console.log(view.rows[0]['user_name']); // Out: 'John'
                    expect(view.rows[0]['user_name']).toBe('John');
                });
            });
            describe("caption", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('username');

                    // caption 설정
                    column.caption = 'User Name';
                    
                    console.log(column.caption); // Out: 'User Name'
                    expect(column.caption).toBe('User Name');
                });
            });
            describe("addConstraint()", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('age');

                    // 제약 조건 추가: 숫자만 허용
                    column.addConstraint({regex: /^\d+$/, msg: 'must be a valid number.'});
                    
                    // 제약 조건 추가: 사용자 정의 함수
                    column.addConstraint((value) => value > 10);
                    
                    // 값 설정 및 유효성 검사
                    column.value = 25;
                    console.log(column.valid(column.value));  // Out: undefined
                    expect(column.valid(column.value)).toBeUndefined();
                    
                    column.value = 'A';
                    console.log(column.valid(column.value));  // { msg: 'must be a valid number.' }
                    expect(column.valid(column.value)).toEqual({ msg: 'must be a valid number.' });
                    
                    column.value = 5;
                    console.log(column.valid(column.value));  // { msg: 'valid(value); function constraint failed...' }
                    expect(column.valid(column.value)).toEqual({ msg: 'valid(value); function constraint failed...' });
                });
            });
            describe("valid()", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('age');

                    // 제약 조건 추가: 숫자만 허용
                    column.addConstraint({regex: /^\d+$/, msg: 'must be a valid number.'});
                    
                    // 제약 조건 추가: 사용자 정의 함수
                    column.addConstraint((value) => value > 10);
                    
                    // 값 설정 및 유효성 검사
                    column.value = 25;
                    console.log(column.valid(column.value));  // Out: undefined
                    expect(column.valid(column.value)).toBeUndefined();
                    
                    column.value = 'A';
                    console.log(column.valid(column.value));  //{ msg: 'must be a valid number.' }
                    expect(column.valid(column.value)).toEqual({ msg: 'must be a valid number.' });
                    
                    column.value = 5;
                    console.log(column.valid(column.value));  // { msg: 'valid(value); function constraint failed...' }
                    expect(column.valid(column.value)).toEqual({ msg: 'valid(value); function constraint failed...' });
                });
            });
            describe("clone()", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('username');

                    // 값 설정
                    column.value = 'John';
                    
                    // 컬럼 복제
                    const clonedColumn = column.clone();
                    
                    // 복제된 컬럼 확인
                    console.log(clonedColumn.columnName); // Out: 'username'
                    console.log(clonedColumn.value);      // Out: 'John'
                    expect(clonedColumn.columnName).toBe('username');
                    expect(clonedColumn.value).toBe('John');
                });
            });
            describe("onChanged", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('status');

                    // onChanged 이벤트 설정
                    column.onChanged = (newValue, oldValue) => {
                        console.log(`Value changed from '${oldValue}' to '${newValue}'`);
                    };
                    
                    // 값 변경
                    column.value = 'Active';   // Out: "Value changed from 'null' to 'Active'"
                    expect(column.value).toBe('Active');
                    column.value = 'Inactive'; // Out: "Value changed from 'Active' to 'Inactive'"
                    expect(column.value).toBe('Inactive');
                });
            });
        });
        describe.skip("HTMLColumn 클래스2", () => {
            describe("_valueTypes", () => {
                it("- 예제", () => {
                    const c1 = new HTMLColumn('aa');

                    // 타입 재정의
                    c1._valueTypes = [String];
                    
                    c1.value = 'Mike';     // 값 등록 성공
                    c1.value = 10;         // 제약조건으로 예외 발생!!

                    console.log(c1._valueTypes); // Out: [String]

                    expect(c1._valueTypes).toEqual([String])
                });
            });
            describe("_entity", () => {
                it("- 예제", () => {
                    const table = new MetaView('users');

                    table.columns.add('name');
                    
                    console.log(table.columns['name']._entity.viewName); // Out: 'users'
                });
            });
            describe("value", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('age');

                    // 기본값 설정
                    column.default = 15;
                    
                    // getter / setter 정의
                    column.getter = () => column.default * 2;
                    column.setter = (val) => { if (val > 0) column.default = val; };
                    
                    console.log(column.value); // Out: 30 (getter를 통해 값 조회)
                    column.value = 30;         // setter를 통해 값 설정
                    console.log(column.value); // Out: 60 (getter를 통해 값 조회)
                });
            });
            describe("default", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('status');

                    // 기본값 설정
                    column.default = 'active';
                    
                    // 값 설정 후 확인
                    column.value = 'inactive';
                    console.log(column.value);  // Out: 'inactive'
                    
                    // 기본값 반환
                    column.value = null;
                    console.log(column.value);  // Out: 'active'
                });
            });
            describe("getter", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('price');

                    // getter 정의
                    column.getter = () => {
                        return column.default + 50;
                    };
                    
                    // 기본값 설정
                    column.default = 100;
                    
                    // 값 조회
                    console.log(column.value); // Out: 150
                });
            });
            describe("setter", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('discount');

                    // setter 설정
                    column.setter = (value) => {
                        if (typeof value !== 'number' || value < 0 || value > 100) {
                            throw new Error('Discount must be a number from 0 to 100.');
                        }
                        return value;  // 내부에 저장됨
                    };
                    
                    // 값 설정
                    column.value = 20;
                    console.log(column.value); // Out: 20
                    
                    try {
                        column.value = 150;   // 유효성 검사 실패!!
                    } catch (e) {
                        console.error(e.message); // Out: 'Discount must be a number from 0 to 100.'
                    }
                });
            });
            describe("getFilter", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('price');

                    // getFilter 설정
                    column.getFilter = (selectorValue) => {
                        return `$${selectorValue.toFixed(2)}`;
                    };
                    
                    // selector 설정
                    column.selector = { key: '#price-input', type: 'value' };
                    // DOM 에 값 입력
                    document.querySelector('#price-input').value = 123.456;
                    
                    console.log(column.value); // Out: '$123.45'
                });
            });
            describe("setFilter", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('price');

                    // setFilter 설정
                    column.setFilter = (innerValue) => {
                        return `$${innerValue.toFixed(2)}`; // 통화 형식으로 변환
                    };
                    
                    // selector 설정
                    column.selector = { key: '#price-input', type: 'value' };
                    
                    // 값 설정
                    column.value = 123.456;
                    console.log(document.querySelector('#price-input').value); // Out: '$123.45'
                });
            });
            describe("selector", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('status');

                    // selector 설정
                    column.selector = { key: '#status-input', type: 'value' };
                    
                    // 값 설정
                    column.value = 'Active'; // HTML 요소의 값이 업데이트됨
                    console.log(document.querySelector('#status-input').value); // Out: 'Active'
                    
                    // DOM 값 입력
                    document.querySelector('#status-input').value = 'Inactive';
                    console.log(column.value); // Out: 'Inactive'
                });
            });
            describe("required", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('username');

                    // 필수 설정
                    column.required = true;
                    
                    // 유효성 검사
                    if (!column.valid(column.value)) {
                        console.error('Value is required for username.');
                    } else {
                        console.log('Value is valid.');
                    }
                });
            });
            describe("constraints", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('email');
                    let check;
                    
                    // constraints 설정
                    column.constraints = [
                        { regex: /^[^@]+@[^@]+\.[^@]+$/, msg: 'Invalid email format.' },
                        (value) => value.length > 3
                    ];
                    
                    // 값 설정 및 유효성 검사
                    column.value = 'example@example.com';
                    check = column.valid(column.value);
                    if (check) {
                        console.error(check.msg);
                    }
                    
                    column.value = 'a@b';
                    check = column.valid(column.value);
                    if (check) {
                        console.error(check.msg); // Out: 'function constraint failed.'
                    }
                    
                    column.value = 'invalid-email';
                    check = column.valid(column.value);
                    if (check) {
                        console.error(check.msg); // Out: 'Invalid email format.'
                    }
                });
            });
            describe("columnName", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('username');

                    console.log(column.columnName); // Out: 'username'
                    console.log(column._name);      // OUt: 'username'
                });
            });
            describe("alias", () => {
                it("- 예제", () => {
                    const view = new MetaView('userView');

                    // 컬럼 추가 및 별칭 설정
                    view.columns.add('u_name', { alias: 'user_name' });
                    
                    let row = view.newRow();
                    row['user_name'] = 'John';
                    view.rows.add(row);
                    
                    console.log(view.rows[0]['user_name']); // Out: 'John'
                });
            });
            describe("caption", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('username');

                    // caption 설정
                    column.caption = 'User Name';
                    
                    console.log(column.caption); // Out: 'User Name'
                });
            });
            describe("addConstraint()", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('age');

                    // 제약 조건 추가: 숫자만 허용
                    column.addConstraint({regex: /^\d+$/, msg: 'must be a valid number.'});
                    
                    // 제약 조건 추가: 사용자 정의 함수
                    column.addConstraint((value) => value > 10);
                    
                    // 값 설정 및 유효성 검사
                    column.value = 25;
                    console.log(column.valid(column.value));  // Out: undefined
                    
                    column.value = 'A';
                    console.log(column.valid(column.value));  // { msg: 'must be a valid number.' }
                    
                    column.value = 5;
                    console.log(column.valid(column.value));  // { msg: 'valid(value); function constraint failed...' }
                });
            });
            describe("valid()", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('age');

                    // 제약 조건 추가: 숫자만 허용
                    column.addConstraint({regex: /^\d+$/, msg: 'must be a valid number.'});
                    
                    // 제약 조건 추가: 사용자 정의 함수
                    column.addConstraint((value) => value > 10);
                    
                    // 값 설정 및 유효성 검사
                    column.value = 25;
                    console.log(column.valid(column.value));  // Out: undefined
                    
                    column.value = 'A';
                    console.log(column.valid(column.value));  //{ msg: 'must be a valid number.' }
                    
                    column.value = 5;
                    console.log(column.valid(column.value));  // { msg: 'valid(value); function constraint failed...' }
                });
            });
            describe("clone()", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('username');

                    // 값 설정
                    column.value = 'John';
                    
                    // 컬럼 복제
                    const clonedColumn = column.clone();
                    
                    // 복제된 컬럼 확인
                    console.log(clonedColumn.columnName); // Out: 'username'
                    console.log(clonedColumn.value);      // Out: 'John'
                });
            });
            describe("onChanged", () => {
                it("- 예제", () => {
                    const column = new HTMLColumn('status');

                    // onChanged 이벤트 설정
                    column.onChanged = (newValue, oldValue) => {
                        console.log(`Value changed from '${oldValue}' to '${newValue}'`);
                    };
                    
                    // 값 변경
                    column.value = 'Active';   // Out: "Value changed from 'null' to 'Active'"
                    column.value = 'Inactive'; // Out: "Value changed from 'Active' to 'Inactive'"
                });
            });
        });
        describe("PropertyCollection 클래스", () => {
            describe("_owner", () => {
                it("- 예제", () => {

                });
            });
            describe("_elemTypes", () => {
                it("- 예제", () => {

                });
            });
            describe("_list", () => {
                it("- 예제", () => {

                });
            });
            describe("count", () => {
                it("- 예제", () => {

                });
            });
            describe("add()", () => {
                it("- 예제", () => {

                });
            });
            describe("clear()", () => {
                it("- 예제", () => {

                });
            });
            describe("exist()", () => {
                it("- 예제", () => {

                });
            });
            describe("remove()", () => {
                it("- 예제", () => {

                });
            });
            describe("removeAt()", () => {
                it("- 예제", () => {

                });
            });
            describe("contains()", () => {
                it("- 예제", () => {

                });
            });
            describe("indexOf()", () => {
                it("- 예제", () => {

                });
            });
            describe("keyToIndex()", () => {
                it("- 예제", () => {

                });
            });
            describe("indexToKey()", () => {
                it("- 예제", () => {

                });
            });
            describe("map()", () => {
                it("- 예제", () => {

                });
            });
            describe("filter()", () => {
                it("- 예제", () => {

                });
            });
            describe("reduce()", () => {
                it("- 예제", () => {

                });
            });
            describe("find()", () => {
                it("- 예제", () => {

                });
            });
            describe("findIndex()", () => {
                it("- 예제", () => {

                });
            });
            describe("forEach()", () => {
                it("- 예제", () => {

                });
            });
            describe("some()", () => {
                it("- 예제", () => {

                });
            });
            describe("every()", () => {
                it("- 예제", () => {

                });
            });
            describe("onAdd", () => {
                it("- 예제", () => {

                });
            });
            describe("onAdded", () => {
                it("- 예제", () => {

                });
            });
            describe("onRemove", () => {
                it("- 예제", () => {

                });
            });
            describe("onRemoved", () => {
                it("- 예제", () => {

                });
            });
            describe("onClear", () => {
                it("- 예제", () => {

                });
            });
            describe("onCleared", () => {
                it("- 예제", () => {

                });
            });
        });
        describe("MetaObject 클래스", () => {
            describe("_guid", () => {
                it("- 예제", () => {

                });
            });
            describe("_type", () => {
                it("- 예제", () => {

                });
            });
            describe("equal()", () => {
                it("- 예제", () => {

                });
            });
            describe("getTypes()", () => {
                it("- 예제", () => {

                });
            });
            describe("instanceOf()", () => {
                it("- 예제", () => {

                });
            });
            describe("getObject()", () => {
                it("- 예제", () => {

                });
            });
            describe("setObject()", () => {
                it("- 예제", () => {

                });
            });
        });
    });
});

/**
 *  
 *  - 주요 클래스
 *      - BindModel 클래스
 *      - BindCommand 클래스
 *      - MetaView 클래스
 *      - HTMLColumn 클래스
 *      - PropertyCollection 클래스
 *      - MetaObject 클래스
 */
