class BaseNoticeService extends BaseService {

    

    constructor(_SUFF = '') {
        super(_SUFF);

        var _this = this;    

        this.items = {
            // inner
            // __isGetLoad:    true,
            // __mode:         '',
            // view
            _area_temp:     { selector: { key: '#area-temp'+ _SUFF,         type: 'html' } },
            _area_tbody:    { selector: { key: '#area-tbody'+ _SUFF,        type: 'html' } },
            _area_form:     { selector: { key: '#class-form'+ _SUFF,        type: 'prop.class' } },
            // _area_page:     { selector: { key: '#s-area-page'+ _SUFF,       type: 'html' } },
            // _txt_sumCnt:    { selector: { key: '#s-txt-sumCnt'+ _SUFF,      type: 'text' } },
            // bind
            // cmd:            '',
            // keyword:        { selector: { key: '#m-keyword'+ _SUFF,         type: 'value' } },
            // page_size:      {
            //     selector: { key: 'select[name=m-page_size]'+ _SUFF,         type: 'value' },
            //     getter: () => { return page.page_size; },
            //     setter: (val) => { page.page_size = val; },
            // },
            // page_count:     {   /** 값을 외부에서 관리함! */
            //     getter: () => { return page.page_count; },
            //     setter: (val) => { return page.page_count = val; }
            // },              
            // sort_cd:        '',
            
            ntc_idx:        '',
            title:          { 
                selector: { key: '#title'+ _SUFF,        type: 'value' },
                required: true,
            },
            contents:       { selector: { key: '#contents'+ _SUFF,     type: 'value' } },
            top_yn:      { 
                selector: { key: 'input[name=top_yn'+_SUFF+'][type=radio]',  type: 'none' },
                setFilter: function (val) { 
                    $('input[name=top_yn'+_SUFF+'][value='+ val + ']').prop('checked', true);
                },
                getFilter: function (val) {
                    return $('input[name=top_yn'+_SUFF+']:checked').val();
                },
            },
            active_cd:      { 
                selector: { key: 'input[name=active_cd'+_SUFF+'][type=radio]',  type: 'none' },
                setFilter(val) { 
                    $('input[name=active_cd'+_SUFF+'][value='+ val + ']').prop('checked', true);
                },
                getFilter(val) {
                    return $('input[name=active_cd'+_SUFF+']:checked').val();
                },
            },
        };
        
        this.fn = {
            // searchList() {
            //     _this.bindModel.items['page_count'].value = 1;
            //     _this.bindModel.list.execute();
            // },
            // changePagesize(e) {
            //     _this.bindModel.items['page_size'].value = this.value;
            //     _this.bindModel.items['page_count'].value = 1;
            //     _this.bindModel.list.execute();
            // },
            // resetForm() { 
            //     $('form').each( () => {
            //         this.reset();
            //     });
            // },
            // moveList() {
            //     var url = _this.bindModel.prop['__listUrl'];
            //     location.href = url;
            // },
            moveEdit(p_evt_idx) {
                var url = _this.bindModel.prop['__formUrl'];
                location.href = url +'?mode=EDIT&evt_idx='+ p_evt_idx;
            },
            // moveForm() {
            //     var url = _this.bindModel.prop['__formUrl'];
            //     location.href = url;
            // },
            procCreate: function() {
                _this.bindModel.create.execute();
            },
            procRead: function(ntc_idx) { 
                _this.bindModel.columns['ntc_idx'].value = ntc_idx;
                _this.bindModel.command['read'].execute();
            },
            procDelete: function() {
                _this.bindModel.command['delete'].execute();
            },
            procUpdate: function() { 
                _this.bindModel.command['update'].execute();
            },
            procList: function() { 
                _this.bindModel.command['list'].execute();
            }
        };
    
        // 전처리
        this.preRegister = function(p_bindModel) {
            // 초기값 설정 : 서버측 > 파라메터 > 내부(기본값)
            // p_bindModel.items['keyword'].value = decodeURI(getArgs('', getParamsToJSON(location.href).keyword ));
            // p_bindModel.items['page_count'].value  = Number( getArgs('', getParamsToJSON(location.href).page_count, page.page_count) );
            
            // // page 콜백 함수 설정 (방식)
            // if (p_bindModel.prop['__isGetLoad'] === true) {
            //     page.callback = page.goPage.bind(p_bindModel.list.bind);            // 2-1) GET 방식
            // } else {
            //     page.callback = p_bindModel.list.execute.bind(p_bindModel.list);    // 1) 콜백 방식
            // }
        }
    }
    
    
}