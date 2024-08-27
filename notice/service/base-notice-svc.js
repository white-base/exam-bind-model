class BaseNoticeService extends BaseService {

    constructor() {
        super();
    }
    
    items = {
        // inner
        __isGetLoad:    true,
        __mode:         '',
        // view
        _temp_list:     { selector: { key: '#s-temp-list'+ _SUFF,       type: 'html' } },
        _area_list:     { selector: { key: '#s-area-list'+ _SUFF,       type: 'html' } },
        _area_page:     { selector: { key: '#s-area-page'+ _SUFF,       type: 'html' } },
        _txt_sumCnt:    { selector: { key: '#s-txt-sumCnt'+ _SUFF,      type: 'text' } },
        // bind
        cmd:            '',
        keyword:        { selector: { key: '#m-keyword'+ _SUFF,         type: 'value' } },
        page_size:      {
            selector: { key: 'select[name=m-page_size]'+ _SUFF,         type: 'value' },
            getter: () => { return page.page_size; },
            setter: (val) => { page.page_size = val; },
        },
        page_count:     {   /** 값을 외부에서 관리함! */
            getter: () => { return page.page_count; },
            setter: (val) => { return page.page_count = val; }
        },              
        sort_cd:        '',
        evt_idx:        '',
        title:          { 
            selector: { key: '#m-title'+ _SUFF,        type: 'value' },
            isNotNull: true,
        },
        writer:         { selector: { key: '#m-writer'+ _SUFF,       type: 'value' } },
        begin_dt:       { selector: { key: '#m-begin_dt'+ _SUFF,     type: 'value' } },
        close_dt:       { selector: { key: '#m-close_dt'+ _SUFF,     type: 'value' } },
        contents:       { selector: { key: '#m-contents'+ _SUFF,     type: 'value' } },
        active_yn:      { 
            selector: { key: 'input[name=m-active_yn'+_SUFF+'][type=radio]',  type: 'none' },
            setFilter(val) { 
                $('input[name=m-active_yn'+_SUFF+'][value='+ val + ']').prop('checked', true);
            },
            getFilter(val) {
                return $('input[name=m-active_yn'+_SUFF+']:checked').val();
            },
            isNotNull: true,
        },
    };
    
    fn = {
        searchList() {
            _this.bindModel.items['page_count'].value = 1;
            _this.bindModel.list.execute();
        },
        changePagesize(e) {
            _this.bindModel.items['page_size'].value = this.value;
            _this.bindModel.items['page_count'].value = 1;
            _this.bindModel.list.execute();
        },
        resetForm() { 
            $('form').each( () => {
                this.reset();
            });
        },
        // moveList() {
        //     var url = _this.bindModel.prop['__listUrl'];
        //     location.href = url;
        // },
        // moveEdit(p_evt_idx) {
        //     var url = _this.bindModel.prop['__formUrl'];
        //     location.href = url +'?mode=EDIT&evt_idx='+ p_evt_idx;
        // },
        // moveForm() {
        //     var url = _this.bindModel.prop['__formUrl'];
        //     location.href = url;
        // },
        procRead(p_evt_idx) { 
            _this.bindModel.items['evt_idx'].value = ParamGet2JSON(location.href).evt_idx;
            _this.bindModel.read.execute(); 
        }
    };

    // 전처리
    preRegister = function(bimdmodel) {
        // 초기값 설정 : 서버측 > 파라메터 > 내부(기본값)
        p_bindModel.items['keyword'].value = decodeURI(getArgs('', getParamsToJSON(location.href).keyword ));
        p_bindModel.items['page_count'].value  = Number( getArgs('', getParamsToJSON(location.href).page_count, page.page_count) );
        
        // page 콜백 함수 설정 (방식)
        if (p_bindModel.prop['__isGetLoad'] === true) {
            page.callback = page.goPage.bind(p_bindModel.list.bind);            // 2-1) GET 방식
        } else {
            page.callback = p_bindModel.list.execute.bind(p_bindModel.list);    // 1) 콜백 방식
        }
    }
}