import BaseNoticeService from './base-notice-svc.js';

class NoticeFrontService extends BaseNoticeService {
    constructor() {
        super();

        var _this       = this;
        var _template   = null;     // Handlebars template

        this.command = {
            read: {
                outputOption: 'VIEW',
                cbBegin(model, cmd) { 
                    cmd.outputOption.index = Number(cmd._model.items._index);
                    cmd._model.columns._area_form.value = '';  // form show
                },
            },
            list: {
                outputOption: 'ALL',
                cbBegin(model, cmd) {
                    cmd._model.columns._area_form.value = 'd-none'; // form hidden
                },
                cbOutput(outs, cmd, res) {
                    if (_template === null) {
                        _template = Handlebars.compile( _this.bindModel.columns['_area_temp'].value ); 
                    }
                    _this.bindModel.columns['_area_tbody'].value   = _template(outs[0].rows);

                    document.getElementById('area-tbody').addEventListener('click', function (e) {
                        const target = e.target.closest('.btnNormal');
                        if (target && target.dataset.index) {
                            const index = parseInt(target.dataset.index, 10);
                            if (!isNaN(index)) {
                            cmd._model.fn.procRead(index);
                            }
                        }
                    });
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

export {
    NoticeFrontService as default,
    NoticeFrontService
}