class NoticeAdminService extends BaseNoticeService {

    constructor() {
        super();

        this.command = {
            create:     {
                cbBegin(p_bindCommand) { _this.bindModel.items['cmd'].value = 'CREATE'; },
                cbEnd(p_entity) {
                    if (p_entity['return'] < 0) return alert('등록 처리가 실패 하였습니다. Code : ' + p_entity['return']);
                    _this.bindModel.fn.moveList();  // 개선함
                },
            },
            read:       {
                outputOption: 3,
                cbBegin(p_bindCommand) { _this.bindModel.items['cmd'].value = 'READ'; },
                cbEnd(p_entity) {
                    if (p_entity['return'] < 0) return alert('조회 처리가 실패 하였습니다. Code : ' + p_entity['return']);
                }
            },
            update:     {
                cbBegin(p_bindCommand) { _this.bindModel.items['cmd'].value = 'UPDATE'; },
                cbEnd(p_entity) {
                    if (p_entity['return'] < 0) return alert('수정 처리가 실패 하였습니다. Code : ' + p_entity['return']);
                    alert('수정 처리가 되었습니다.');
                    _this.bindModel.read.execute();
                }
            },
            delete:     {
                cbBegin(p_bindCommand) { _this.bindModel.items['cmd'].value = 'DELETE'; },
                cbValid(p_valid) { return confirm('삭제 하시겠습니까.?'); },
                cbEnd(p_entity) {
                    if (p_entity['return'] < 0) return alert('삭제 처리가 실패 하였습니다. Result Code : ' + p_entity['return']);
                    _this.bindModel.fn.moveList();  // 개선함
                }
            },
            list:       {
                outputOption: 1,
                cbBegin(p_bindCommand) { _this.bindModel.items['cmd'].value = 'LIST'; },
                cbOutput(p_result) {
                    if (global.isLog) console.log("[Service] list.cbOutput() : 목록출력");
    
                    var entity = p_result['table'];
                    var row_total   = entity['row_total'];
    
                    if (_template === null) {
                        _template = Handlebars.compile( _this.bindModel.items['_temp_list'].value ); 
                    }
                    _this.bindModel.items['_txt_sumCnt'].value  = row_total;
                    _this.bindModel.items['_area_list'].value   = _template(entity);
                    _this.bindModel.items['_area_page'].value   = page.parser(row_total);
                },
                cbEnd(p_result) {
                    if (p_result['return'] < 0) return alert('목록조회 처리가 실패 하였습니다. Code : ' + p_result['return']);
                }
            }
        };
        
        this.mapping = {
            _temp_list:     { list:     'etc' },    // 묶음의 용도
            _area_list:     { list:     'etc' },    // 묶음의 용도
            _area_page:     { list:     'etc' },    // 묶음의 용도
            _txt_sumCnt:    { list:     'etc' },    // 묶음의 용도
            cmd:            { Array:    'bind' },
            keyword:        { list:     'bind' },
            page_size:      { list:     'bind' },
            page_count:     { list:     'bind' },
            sort_cd:        { list:     'bind' },
            evt_idx:        { read:     'bind',     delete:     'bind',            update:  'bind' },
            title:          { read:     'output',   create:     ['valid', 'bind'], update:  ['valid', 'bind'], },
            writer:         { read:     'output',   create:     'bind',            update:  'bind' },
            begin_dt:       { read:     'output',   create:     'bind',            update:  'bind' },
            close_dt:       { read:     'output',   create:     'bind',            update:  'bind' },
            contents:       { read:     'output',   create:     'bind',            update:  'bind' },
            active_yn:      { read:     'output',   create:     ['valid', 'bind'], update:  ['valid', 'bind'], },
        };

    }    
}