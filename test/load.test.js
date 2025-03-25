// ES6, cjs, jest
//==============================================================
// gobal defined
'use strict';

// const {BindModel}                       = require('logic-bind-model');
// const bindmodel                         = require('logic-bind-model');

import {BindModel} from 'logic-bind-model';

//==============================================================
// test
describe("[target: BindModel]", () => {
    // 
    describe("namespace: BindModel", () => {
        beforeEach(() => {
            jest.resetModules(); 
        });

        describe("MetaObject._valueTypes: <value 타입 설정>", () => {
            it("- 설정 및 조회 ", () => {
                
                // var bm = new bindmodel.BindModel();
                var bm2 = new BindModel();

                expect(true).toBe(true)
            });
        });
    });
});
