class NoticeAdminService extends BaseNoticeService {

    constructor() {
        super();

        var _this       = this;
        var _template   = null;     // Handlebars template

        this.command = {
            create:     {
            },
            read:       {
                outputOption: 3,
                cbBegin(cmd) { 
                    var ntc_idx= cmd._model.columns['ntc_idx'].value;
                    cmd.url = `data/read${ntc_idx}.json`;
                    cmd._model.columns._area_form.value = '';  // form show
                },
            },
            update:     {
                cbBind(bind, cmd, setup) {
                    console.warn('주의 : 테스트 서버 경로로 전송하지만 반영하지 않습니다. ', setup.data);
                },
                cbEnd(status, cmd, res) {
                    alert('수정 처리가 되었습니다.');
                }
            },
            delete:     {
                cbValid(valid, cmd) { 
                    if (confirm('삭제 하시겠습니까.?')) return true;
                },
                cbBind(bind, cmd, setup) {
                    console.warn('주의 : 테스트 서버 경로로 전송하지만 반영하지 않습니다.', setup.data);
                },
                cbEnd(status, cmd, res) {
                    if (res) {
                        alert('삭제 되었습니다.');
                        _this.bindModel.fn.procList();
                    }
                }
            },
            list:       {
                outputOption: 1,
                cbBegin(cmd) {
                    cmd._model.columns._area_form.value = 'd-none';
                },
                cbOutput(outs, cmd, res) {
                    if (_template === null) {
                        _template = Handlebars.compile( _this.bindModel.columns['_area_temp'].value ); 
                    }
                    _this.bindModel.columns['_area_tbody'].value   = _template(res.data);
                },
            }
        };
        
        this.mapping = {
            _area_temp:      { list:     'misc' },
            _area_tbody:     { list:     'misc' },
            _area_form:      { list:     'misc' },
            ntc_idx:        { read:     'bind',     delete:     'bind',            update:  'bind' },
            title:          { read:     'output',   create:     ['valid', 'bind'], update:  ['valid', 'bind'], },
            contents:       { read:     'output',   create:     'bind',            update:  'bind' },
            top_yn:         { read:     'output',   create:     ['valid', 'bind'], update:  ['valid', 'bind'], },
            active_cd:      { read:     'output',   create:     ['valid', 'bind'], update:  ['valid', 'bind'], },
        };

    }    
}