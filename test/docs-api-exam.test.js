// ES6, cjs, jest
//==============================================================
// gobal defined
'use strict';

const bindmodel = require('logic-bind-model');
const  axios  = require("axios");

jest.mock('axios');

const {BindModel, HTMLColumn, MetaColumn, MetaTable, MetaView, BindCommand} = bindmodel;

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
                it("- 예제", () => {
                    const bm = new BindModel();

                    bm.addColumnValue('u_id', 'abc');
                    bm.addCommand('list');
                    
                    bm.command['list'].cbBegin = function(cmd) {
                        console.log(cmd._model.columns['u_id'].value); // Out: 'abc'
                    };                    
                });
            });
            describe("config", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    bm.addCommand('cmd1');
                    
                    // 명령의 서버 요청 설정
                    bm.command['cmd1'].config = {
                        method: 'GET',
                        url: '/api/users',
                        headers: { Authorization: 'Bearer token123' },
                        timeout: 5000
                    };
                    
                    // 명령 실행
                    bm.command['cmd1'].execute();                    
                });
            });
            describe("url", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    // 명령 추가
                    bm.addCommand('cmd1');
                    
                    // URL 설정
                    bm.command['cmd1'].url = '/api/data';
                    
                    bm.command['cmd1'].execute();                    
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
                    
                    bm.command['cmd1'].execute();                  
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
                });
            });
            describe("valid", () => {
                it("- 예제", () => {
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
                    
                    bm.command['cmd1'].execute();
                });
            });
            describe("bind", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    bm.addCommand('cmd1');
                    
                    // 컬럼 추가
                    bm.command['cmd1'].bind.columns.add('u_id');
                    bm.command['cmd1'].bind.columns.add('email');
                    bm.command['cmd1'].bind.columns['u_id'].value = 101;
                    bm.command['cmd1'].bind.columns['email'].value = 'abc@gmail.com';
                    // 위와 동일
                    // bm.command['cmd1'].addColumnValue('u_id', 101, 'bind');
                    // bm.command['cmd1'].addColumnValue('email', abc@gmail.com, 'bind');
                    
                    bm.command['cmd1'].execute();                    
                });
            });
            describe("output", () => {
                it("- 예제", () => {
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
                    bm.command['cmd1'].execute();
                    
                    console.log(bm.columns['u_id']);  // [Object HTMLColumn]
                    console.log(bm.command['u_name']); // [Object HTMLColumn]                    
                });
            });
            describe("misc", () => {
                it("- 예제", () => {
                    
                });
            });
            describe("cbBegin", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    // 명령 추가 및 컬럼 값 설정
                    bm.addCommand('cmd1');
                    bm.addColumnValue('u_id', 100);
                    
                    // 콜백 함수 설정
                    bm.command['cmd1'].cbBegin = function(cmd) {
                        const userId = cmd._model.columns['u_id'].value;
                        cmd.url = `/api/users/${userId}`;
                    };
                    
                    // 명령 실행
                    bm.command['cmd1'].execute();                    
                });
            });
            describe("cbValid", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    // 명령 추가 
                    bm.addCommand('cmd1');
                    
                    // 컬럼 추가 및 뷰 매핑
                    bm.addColumnValue('u_name', 'John', 'cmd1', 'valid');
                    
                    // 콜백 함수 설정
                    bm.command['cmd1'].cbValid = function(view, cmd) {
                        const username = view.columns['u_name'].value;
                        if (username.length < 3) {
                            alert('사용자 이름은 3자 이상이어야 합니다.');
                            return false;
                        }
                        return true;
                    };
                    
                    // 명령 실행
                    bm.command['cmd1'].execute();
                });
            });
            describe("cbBind", () => {
                it("- 예제", () => {
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
                    };
                    
                    // 명령 실행
                    bm.command['upload'].execute();                    
                });
            });
            describe("cbResult", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    // 명령 추가
                    bm.addCommand('cmd1');
                    
                    // 콜백 함수 설정
                    bm.command['cmd1'].cbResult = function(data, cmd, response) {
                        return { rows: data.rows.filter(product => product.inStock) };
                    };
                    
                    // 명령 실행
                    bm.command['cmd1'].execute();                    
                });
            });
            describe("cbOutput", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    // 명령 추가 (1: 모든 데이터 가져오기)
                    bm.addCommand('cmd1', 1);
                    
                    // 콜백 함수 설정
                    bm.command['cmd1'].cbOutput = function(outputs, cmd, response) {
                        const output = outputs[0]; // 첫번째 기본 MetaView
                        output.rows.forEach(product => {
                            console.log(`Product ID: ${product.id}, Name: ${product.name}`);
                        });
                    };
                    
                    bm.command['cmd1'].execute();
                    // Product ID: ...., Name: ....                    
                });
            });
            describe("cbEnd", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    // 명령 추가
                    bm.addCommand('cmd1');
                    
                    // 콜백 함수 설정
                    bm.command['cmd1'].cbEnd = function(status, cmd, response) {
                        if (status > 0) alert('데이터 저장이 완료되었습니다.');
                        else alert('데이터 저장 중 오류가 발생했습니다.');
                    };
                    
                    bm.command['cmd1'].execute();                    
                });
            });
            describe("execute()", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    // 명령 추가
                    bm.addCommand('cmd1');
                    
                    // 유효성 검사 및 서버 요청 추가
                    bm.command['cmd1'].addColumn('u_name', ['valid', 'bind']);
                    
                    // 값 및 제약 조건 설정
                    bm.columns['u_name'].require = true;
                    bm.columns['u_name'].value = 'John';
                    
                    // 명령 실행
                    bm.command['cmd1'].execute();
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
                    
                    console.log(bm.command['cmd1'].valid.columns['u_name']); // [Object HTMLColumn]
                    console.log(bm.command['cmd1'].bind.columns['u_name']);  // [Object HTMLColumn]
                    console.log(bm.command['cmd1'].output.columns['u_name']);// [Object HTMLColumn]
                    console.log(bm.command['cmd1'].misc.columns['u_name']);  // [Object HTMLColumn]                    
                });
                it("- 특정 뷰에만 컬럼 등록", () => {
                    const bm = new BindModel();
                    bm.addCommand('cmd1');

                    // 컬럼 추가 및 뷰에 참조 등록
                    bm.command['cmd1'].addColumn('email', 'valid');
                    bm.command['cmd1'].addColumn('phone', ['bind','output']);

                    console.log(bm.command['cmd1'].valid.columns['email']); // [Object HTMLColumn]
                    console.log(bm.command['cmd1'].bind.columns['phone']);  // [Object HTMLColumn]
                    console.log(bm.command['cmd1'].output.columns['phone']);// [Object HTMLColumn]                    
                });
                it("- 사용자 정의 출력 뷰에 추가", () => {
                    const bm = new BindModel();
                    bm.addCommand('cmd1');

                    // 출력 뷰 추가
                    bm.command['cmd1'].newOutput('out2');

                    // 컬럼 추가 및 추가 출력 뷰에 참조 등록
                    bm.command['cmd1'].addColumn('address', 'out2');

                    console.log(bm.command['cmd1'].out2.columns['address']); // [Object HTMLColumn]                    
                });
            });
            describe("addColumnValue()", () => {
                it("- 모든 뷰에 컬럼 추가", () => {
                    const bm = new BindModel();

                    // 명령 추가
                    bm.addCommand('cmd1');
                    
                    // 컬럼 초기값으로 등록
                    bm.command['cmd1'].addColumnValue('u_name', 'John', ['$all']);
                    
                    console.log(bm.command['cmd1'].valid.columns['u_name'].value);  // Out: 'John'
                    console.log(bm.command['cmd1'].bind.columns['u_name'].value);   // Out: 'John'
                    console.log(bm.command['cmd1'].output.columns['u_name'].value); // Out: 'John'                    
                });
                it("- 특정 뷰에만 컬럼 등록", () => {
                    const bm = new BindModel();
                    bm.addCommand('cmd1');

                    // 컬럼 추가 및 뷰에 매핑
                    bm.command['cmd1'].addColumnValue('email', 'abc@gmail.com', 'valid');
                    bm.command['cmd1'].addColumnValue('phone', '12345', ['bind','output']);

                    console.log(bm.cmd['cmd1'].valid.columns['email'].value); // Out: 'abc@gmail.com'
                    console.log(bm.cmd['cmd1'].bind.columns['phone'].value);  // Out: 12345
                    console.log(bm.cmd['cmd1'].output.columns['phone'].value);// Out: 12345                    
                });
                it("- 사용자 정의 출력 뷰에 추가 ", () => {
                    const bm = new BindModel();
                    bm.addCommand('cmd1');

                    // 출력 뷰 추가
                    bm.command['cmd1'].newOutput('out2');

                    // 컬럼 추가 및 뷰에 매핑
                    bm.command['cmd1'].addColumnValue('address', 'Home', 'out2');

                    console.log(bm.command['cmd1'].out2.columns['address'].value); // Out: 'Home'                    
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
                    
                    console.log(bm.command['cmd1'].output.columns['aa'].value); // Out: 10
                    
                    // 컬럼 참조 설정
                    bm.command['cmd2'].setColumn(['bb', 'cc'], ['valid', 'bind']);

                    console.log(bm.command['cmd2'].valid.columns['bb'].value);  // Out: 20
                    console.log(bm.command['cmd2'].bind.columns['cc'].value);   // Out: 30
                    console.log(bm.command['cmd2'].valid.columns['bb'].value);  // Out: 20
                    console.log(bm.command['cmd2'].bind.columns['cc'].value);   // Out: 30  
                    
                    // 컬럼 참조 설정
                    bm.command['cmd3'].setColumn('aa', '$all'); // views 기본값 : '$all'

                    console.log(bm.command['cmd3'].valid.columns['aa'].value);  // Out: 10
                    console.log(bm.command['cmd3'].bind.columns['aa'].value);   // Out: 10
                    console.log(bm.command['cmd3'].output.columns['aa'].value); // Out: 10
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
                    
                    console.log(bm.command['cmd1'].valid.columns['aa'].value); // Out: 10
                    console.log(bm.command['cmd1'].valid.columns['bb'].value); // Out: 20
                    bm.cmd['cmd1'].output.columns['aa'] === bm.first.columns['aa']  // true
                    bm.cmd['cmd1'].output.columns['bb'] === bm.second.columns['bb'] // true                    
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
                    
                    console.log(bm.command['cmd1'].valid.columns['aa'].value);  // Out: 10
                    console.log(bm.command['cmd1'].bind.columns['aa'].value);   // Out: 10
                    console.log(bm.command['cmd1'].output.columns['aa'].value); // Out: 10
                    console.log(bm.command['cmd1'].misc.columns['aa'].value);   // Out: 10  
                });
                it("- 예제", () => {
                    const bm = new BindModel();
                    bm.addCommand('cmd1');
                    bm.columns.addValue('aa', 10);
                    bm.command['cmd1'].setColumn('aa', '$all');

                    // 컬럼 해제
                    bm.command['cmd1'].release('aa', ['valid', 'bind']);

                    console.log(bm.command['cmd1'].output.columns['aa'].value); // 10
                });
                it("- 예제", () => {
                    const bm = new BindModel();
                    bm.addCommand('cmd1');
                    bm.columns.addValue('aa', 10);
                    bm.command['cmd1'].setColumn('aa', '$all');

                    // 컬럼 해제
                    bm.command['cmd1'].release('aa'); 
                    // 위와 동일
                    // bm.command['cmd1'].release('aa', '$all');

                    console.log(bm.command['cmd1'].valid.columns.count);  // Out: 0
                    console.log(bm.command['cmd1'].bind.columns.count);   // Out: 0
                    console.log(bm.command['cmd1'].output.columns.count); // Out: 0
                    console.log(bm.command['cmd1'].misc.columns.count);   // Out: 0
                });
            });
            describe("newOutput()	", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    // 명령 추가
                    bm.addCommand('cmd1');
                    
                    bm.command['cmd1'].output === bm.command['cmd1'].output1 // true
                });
                it("- 예제", () => {
                    const bm = new BindModel();
                    bm.addCommand('cmd1');

                    // 출력 뷰 추가
                    bm.command['cmd1'].newOutput('info');

                    bm.cmd['cmd1'].ouput2 === bm.cmd['cmd1'].info  // true
                    console.log(bm.command['cmd1'].info);          // [Object MetaView]
                    console.log(bm.command['cmd1'].ouput2);        // [Object MetaView]
                });
                it("- 예제", () => {
                    const bm = new BindModel();
                    bm.addCommand('cmd1');

                    // 출력 뷰 추가
                    bm.command['cmd1'].newOutput();

                    console.log(bm.command['cmd1'].ouput3); // [Object MetaView]
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
                    
                    // 출력 뷰 제거
                    bm.command['cmd1'].removeOutput('customView');
                    
                    console.log(bm.command['cmd1'].customView); // Out: undefined
                    console.log(bm.command['cmd1'].output2);    // Out: undefined                    
                });
            });
            describe("onExecute", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    bm.addCommand('cmd1');
                    
                    // 이벤트 등록
                    bm.command['cmd1'].onExecute = function(model, cmd) {
                        console.log('Execute start...');
                    };
                    
                    bm.command['cmd1'].execute();                    
                });
            });
            describe("onExecuted", () => {
                it("- 예제", () => {
                    const bm = new BindModel();

                    bm.addCommand('cmd1');
                    
                    // 이벤트 등록
                    bm.command['cmd1'].onExecuted = function(model, cmd) {
                        console.log('Execute End...');
                    };
                    
                    bm.command['cmd1'].execute();                    
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
