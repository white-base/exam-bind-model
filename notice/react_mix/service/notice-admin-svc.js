import BaseNoticeService from './base-notice-svc.js';

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
                    cmd.outputOption.index = Number(cmd._model.items._index);
                },
            },
            update:     {
                cbBind(bind, cmd, setup) {
                    console.warn('Caution: Send to the test server, but the data is not reflected.', setup.data);
                },
                // cbEnd(status, cmd, res) {
                //     if (res) alert('It has been modified.');
                // }
            },
            delete:     {
                cbValid(valid, cmd) { 
                    if (confirm('Are you sure you want to delete it?')) return true;
                },
                cbBind(bind, cmd, setup) {
                    console.warn('Caution: Send to the test server, but the data is not reflected.', setup.data);
                },
                // cbEnd(status, cmd, res) {
                //     if (res) {
                //         alert('The post has been deleted.');
                //         _this.bindModel.cmd['list'].execute();
                //     }
                // }
            },
            list:       {
                outputOption: 1,
                // cbBegin(cmd) {
                // },
                // cbOutput(outs, cmd, res) {
                // },
            }
        };

        this.mapping = {
            ntc_idx:    { read:     ['bind', 'output'],     update:  'bind',               delete:     'bind' },
            title:      { read:     'output',               update:  ['valid', 'bind'], },
            contents:   { read:     'output',               update:  'bind' },
            top_yn:     { read:     'output',               update:  ['valid', 'bind'], },
            active_cd:  { read:     'output',               update:  ['valid', 'bind'], },
            create_dt:  { read:     'output' },
        };
    }    
}

export {
    NoticeAdminService as default,
    NoticeAdminService
}