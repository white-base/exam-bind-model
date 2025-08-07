class ListService {
    constructor(_SUFF = '') {
        
        const _this     = this;
        let _template   = null;     // Handlebars template

        this.items = {
            _area_temp: { selector: { key: `#area-temp${_SUFF}`,    type: 'html' } },
            _area_tbody: { selector: { key: `#area-tbody${_SUFF}`,   type: 'html' } },
        };
        
        this.command = {
            list: {
                cbOutput(outs, cmd, res) {
                    if (_template === null) {
                        _template = Handlebars.compile( _this.bindModel.columns['_area_temp'].value ); 
                    }
                    _this.bindModel.columns['_area_tbody'].value   = _template(outs[0].rows);
                },
            }
        };

        this.mapping = {
            _area_temp:     { list:     'misc' },
            _area_tbody:    { list:     'misc' },
        };
    }
}

export {
    ListService as default,
    ListService
}