import BaseNoticeService from './base-notice-svc.js';

class NoticeAdminService extends BaseNoticeService {
    constructor() {
        super();

        var _this       = this;
        var _template   = null;     // Handlebars template

        this.cbBaseBind = function (bind, cmd, setup) {
            console.warn('Caution: Send to the test server, but the data is not reflected.', setup.data);
        }
        this.command = {
            create: {
                cbEnd(status, cmd, res) {
                    if (res) {
                        alert('The post has been created.');
                        _this.bindModel.cmd['list'].execute();
                    }
                }
            },
            read: {
                outputOption: 'VIEW',
                cbBegin(model, cmd) { 
                    cmd.outputOption.index = Number(cmd._model.items._index);
                    model.columns['_area_form'].value = '';  // form show
                    model.columns['_area_edit'].value = '';  // button show
                    model.columns['_area_create'].value = 'd-none';
                    model.columns['_area_button'].value = 'd-none';
                },
            },
            update: {
                cbEnd(status, cmd, res) {
                    if (res) alert('It has been modified.');
                }
            },
            delete: {
                cbValid(valid, cmd) { 
                    if (confirm('Are you sure you want to delete it?')) return true;
                },
                cbEnd(status, cmd, res) {
                    if (res) {
                        alert('The post has been deleted.');
                        cmd._model.command['list'].execute();
                    }
                }
            },
            list: {
                outputOption: 'ALL',
                cbBegin(model, cmd) {
                    model.columns['_area_form'].value = 'd-none';
                    model.columns['_area_button'].value = '';

                },
                cbOutput(outs, cmd, res) {
                    Handlebars.registerHelper('translateActive', function (code) {
                        if (code === 'S') return 'Standby';
                        if (code === 'A') return 'Activation';
                        if (code === 'H') return 'hidden';
                        return '';
                    });
                    if (_template === null) {
                        _template = Handlebars.compile( _this.bindModel.columns['_area_temp'].value ); 
                    }
                    _this.bindModel.columns['_area_tbody'].value   = _template(res.data);

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
            _area_temp:     { list: 'misc' },
            _area_tbody:    { list: 'misc' },
            _area_form:     { list: 'misc' },
            _area_edit:     { list: 'misc' },
            _area_create:   { list: 'misc' },
            _area_button:   { list: 'misc' },
            ntc_idx:        { read: ['bind', 'output'],    update: 'bind',  delete: 'bind' },
            title:          { create: ['valid', 'bind'],   read: 'output',  update: ['valid', 'bind'], },
            contents:       { create: 'bind',              read: 'output',  update: 'bind' },
            top_yn:         { create: 'bind',              read: 'output',  update: ['valid', 'bind'], },
            active_cd:      { create: 'bind',              read: 'output',  update: ['valid', 'bind'], },
            create_dt:      { read: 'output' },
        };
    }    
}

export {
    NoticeAdminService as default,
    NoticeAdminService
}