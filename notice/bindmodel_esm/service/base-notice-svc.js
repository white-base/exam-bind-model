import BaseService from './base-svc.js';

class BaseNoticeService extends BaseService {
    constructor(_SUFF = '') {
        super(_SUFF);

        var _this = this;    

        this.items = {
            // misc
            _area_temp: { selector: { key: `#area-temp${_SUFF}`,    type: 'html' } },
            _area_tbody:{ selector: { key: `#area-tbody${_SUFF}`,   type: 'html' } },
            _area_form: { selector: { key: `#class-form${_SUFF}`,   type: 'prop.class' } },
            _index:     0,
            // valid, bind, output
            ntc_idx:        '',
            title:      { 
                selector: { key: `#title${_SUFF}`,        type: 'value' },
                required: true,
            },
            contents:   { selector: { key: `#contents${_SUFF}`,     type: 'value' } },
            top_yn:     { 
                selector: { key: `input[name=top_yn${_SUFF}]`,      type: 'none' },
                setFilter: function (val) { 
                    $(`input[name=top_yn${_SUFF}]`).prop('checked', val == 'Y' ? true : false);
                },
                getFilter: function (val) {
                    return $(`input[name=top_yn${_SUFF}]:checked`).val();
                },
            },
            active_cd:  { 
                selector: { key: `input[name=active_cd${_SUFF}][type=radio]`,  type: 'none' },
                setFilter(val) { 
                    $(`input[name=active_cd${_SUFF}][value=${val}]`).prop('checked', true);
                },
                getFilter(val) {
                    return $(`input[name=active_cd${_SUFF}]:checked`).val();
                },
            },
            create_dt:  {
                selector: { key: `#create_dt${_SUFF}`,  type: 'text' }
            }
        };
        
        this.fn = {
            procRead(index) { 
                _this.bindModel.items._index = index;
                _this.bindModel.command['read'].execute();
            }
        };
    }
}

export {
    BaseNoticeService as default,
    BaseNoticeService
}