class NoticeAdminService extends BaseNoticeService {

    constructor() {
        super();

        var _this       = this;
        var _template   = null;


        this.command = {
            create:     {
                cbBegin(bindCmd) { _this.bindModel.items['cmd'].value = 'CREATE'; },
                cbEnd(p_entity) {
                    if (p_entity['return'] < 0) return alert('등록 처리가 실패 하였습니다. Code : ' + p_entity['return']);
                    // _this.bindModel.fn.moveList();  // 개선함
                },
            },
            read:       {
                outputOption: 3,
                cbBegin(bindCmd) { 
                    var ntc_idx= bindCmd._model.columns['ntc_idx'].value;
                    bindCmd.url = `data/read${ntc_idx}.json`;
                    bindCmd._model.columns._area_form.value = '';  // form show
                    // _this.bindModel.items['cmd'].value = 'READ';
                },
                cbEnd(p_entity) {
                    if (p_entity['return'] < 0) return alert('조회 처리가 실패 하였습니다. Code : ' + p_entity['return']);
                }
            },
            update:     {
                cbBegin(bindCmd) { 
                    // _this.bindModel.items['cmd'].value = 'UPDATE'; 
                    bindCmd._model.columns._area_form.value = '';   // form show
                },
                cbEnd(p_entity) {
                    if (p_entity['return'] < 0) return alert('수정 처리가 실패 하였습니다. Code : ' + p_entity['return']);
                    alert('수정 처리가 되었습니다.');
                    // _this.bindModel.read.execute();
                }
            },
            delete:     {
                cbBegin(bindCmd) {
                    // bindCmd.url = 'data/read.json';
                    // _this.bindModel.items['cmd'].value = 'DELETE'; 
                },
                cbValid(p_valid) { return confirm('삭제 하시겠습니까.?'); },
                cbEnd(status, cmd, res) {
                    // if (p_entity['return'] < 0) return alert('삭제 처리가 실패 하였습니다. Result Code : ' + p_entity['return']);
                    if (res) {
                        alert('삭제 되었습니다.');
                        _this.bindModel.fn.procList();  // 개선함
                    }
                }
            },
            list:       {
                outputOption: 1,
                cbBegin(bindCmd) {
                    bindCmd._model.columns._area_form.value = 'd-none';
                    // _this.bindModel.items['cmd'].value = 'LIST'; 
                },
                cbOutput(outputs, cmd, res) {
                    // if (global.isLog) console.log("[Service] list.cbOutput() : 목록출력");
    
                    // var entity = p_result['table'];
                    // var row_total   = entity['row_total'];
    
                    if (_template === null) {
                        _template = Handlebars.compile( _this.bindModel.columns['_area_temp'].value ); 
                        // _template = Handlebars.compile($('#temp-list').html() ); 
                    }
                    // _this.bindModel.items['_txt_sumCnt'].value  = row_total;
                    _this.bindModel.columns['_area_tbody'].value   = _template(res.data);
                    // _this.bindModel.items['_area_page'].value   = page.parser(row_total);
                },
                cbEnd(p_result) {
                    if (p_result['return'] < 0) return alert('목록조회 처리가 실패 하였습니다. Code : ' + p_result['return']);
                }
            }
        };
        
        this.mapping = {
            _area_temp:      { list:     'misc' },    // 묶음의 용도
            _area_tbody:     { list:     'misc' },    // 묶음의 용도
            _area_form:      { list:     'misc' },    // 묶음의 용도
            // _area_page:     { list:     'etc' },    // 묶음의 용도
            // _txt_sumCnt:    { list:     'etc' },    // 묶음의 용도
            // cmd:            { Array:    'bind' },
            // keyword:        { list:     'bind' },
            // page_size:      { list:     'bind' },
            // page_count:     { list:     'bind' },
            // sort_cd:        { list:     'bind' },
            ntc_idx:        { read:     'bind',     delete:     'bind',            update:  'bind' },
            title:          { read:     'output',   create:     ['valid', 'bind'], update:  ['valid', 'bind'], },
            contents:       { read:     'output',   create:     'bind',            update:  'bind' },
            top_yn:         { read:     'output',   create:     ['valid', 'bind'], update:  ['valid', 'bind'], },
            active_cd:      { read:     'output',   create:     ['valid', 'bind'], update:  ['valid', 'bind'], },
        };

    }    
}