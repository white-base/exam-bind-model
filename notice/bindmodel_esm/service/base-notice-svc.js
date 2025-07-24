class BaseNoticeService {
    constructor(_SUFF = '') {
        var _this = this;    

        this.items = {
            // misc
            _area_temp: { selector: { key: `#area-temp${_SUFF}`,    type: 'html' } },
            _area_tbody: { selector: { key: `#area-tbody${_SUFF}`,   type: 'html' } },
            _area_form: { selector: { key: `#class-form${_SUFF}`,   type: 'attr.class' } },
            _area_btn_edit: { selector: { key: `#edit-button${_SUFF}`,   type: 'attr.class' } },
            _area_btn_create: { selector: { key: `#create-button${_SUFF}`,   type: 'attr.class' } },
            _area_btn_form: { selector: { key: `#form-button${_SUFF}`,   type: 'attr.class' } },
            _index:     0,
            // valid, bind, output
            ntc_idx:    { selector: { key: `#ntc_idx${_SUFF}`,   type: 'value' } },
            title:      { 
                selector: { key: `#title${_SUFF}`,        type: 'value' },
                required: true,
            },
            contents:   { selector: { key: `#contents${_SUFF}`,     type: 'value' } },
            top_yn:     { 
                selector: { key: `input[name=top_yn${_SUFF}]`,      type: 'none' },
                setFilter(val) { 
                    $(`input[name=top_yn${_SUFF}]`).prop('checked', val == 'Y' ? true : false);
                },
                getFilter(val) {
                    return $(`input[name=top_yn${_SUFF}]:checked`).val() || 'N';
                }
            },
            active_cd:  {
                selector: { key: `input[name=active_cd${_SUFF}][type=radio]`,  type: 'none' },
                setFilter(val) { 
                    $(`input[name=active_cd${_SUFF}][value=${val}]`).prop('checked', true);
                },
                getFilter(val) {
                    return $(`input[name=active_cd${_SUFF}]:checked`).val();
                }
            },
            create_dt:  { selector: { key: `#create_dt${_SUFF}`,  type: 'text' } }
        };
        
        this.fn = {
            createFrom(form) {
                document.getElementById(form).reset();
                _this.bindModel.columns['_area_form'].value = '';
                _this.bindModel.columns['_area_btn_create'].value = '';
                _this.bindModel.columns['_area_btn_edit'].value = 'd-none';
                _this.bindModel.columns['_area_btn_form'].value = 'd-none';
            }
        };
    }
}

export {
    BaseNoticeService as default,
    BaseNoticeService
}