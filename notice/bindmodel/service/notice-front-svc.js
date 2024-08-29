// import BaseNoticeService from './base-notice-svc'

class NoticeFrontService extends BaseNoticeService {
    constructor() {
        super();

        var _this       = this;
        var _template   = null;     // Handlebars template

        this.command = {
            read:       {
                outputOption: 3,
                cbBegin(cmd) { 
                    // var ntc_idx= cmd._model.columns['ntc_idx'].value;
                    // cmd.url = `/notice/data/read${ntc_idx}.json`;
                    cmd.outputOption.index = Number(cmd._model.items._index);
                    cmd._model.columns._area_form.value = '';  // form show
                },
            },  
            list:       {
                outputOption: 1,
                cbBegin(cmd) {
                    cmd._model.columns._area_form.value = 'd-none'; // form hidden
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
            _area_temp:     { list:     'misc' },
            _area_tbody:    { list:     'misc' },
            _area_form:     { list:     'misc' },
            ntc_idx:        { read:     'bind' },
            title:          { read:     'output' },
            contents:       { read:     'output' },
            create_dt:      { read:     'output' },
        };
    }
}

// export default NoticeFrontService;