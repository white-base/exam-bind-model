class NoticeFrontService extends BaseNoticeService {

    constructor() {
        super();

        this.command = {
            read:       {
                outputOption: 3,
                cbBegin(p_bindCommand) { _this.bindModel.items['cmd'].value = 'READ'; },
                cbEnd(p_entity) {
                    if (p_entity['return'] < 0) return alert('조회 처리가 실패 하였습니다. Code : ' + p_entity['return']);
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
            },
        };  

        this.mapping = {
            // _temp_list:     { list:     'etc' },    // 묶음의 용도
            // _area_list:     { list:     'etc' },    // 묶음의 용도
            // _area_page:     { list:     'etc' },    // 묶음의 용도
            // cmd:            { $all:     'bind' },
            // keyword:        { list:     'bind' },
            // page_size:      { list:     'bind' },
            // page_count:     { list:     'bind' },
            // sort_cd:        { list:     'bind' },
            ntc_idx:        { read:     'bind' },
            title:          { read:     'output' },
            contents:       { read:     'output' },
            create_dt:      { read:     'output' },
        };
    }
}