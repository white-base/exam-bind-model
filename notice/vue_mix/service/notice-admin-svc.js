export default class NoticeAdminService {
    constructor() {
        var _this       = this;
        var _template   = null;     // Handlebars template

        this.items = {
            ntc_idx: { required: true },
            title: { required: true }
        },
        this.command = {
            create:     {
            },
            read:       {
                outputOption: 3,
            },
            update:     {
                cbBind(bind, cmd, setup) {
                    console.warn('Caution: Send to the test server, but the data is not reflected.', setup.data);
                },
            },
            delete:     {
                cbValid(valid, cmd) { 
                    if (confirm('Are you sure you want to delete it?')) return true;
                },
                cbBind(bind, cmd, setup) {
                    console.warn('Caution: Send to the test server, but the data is not reflected.', setup.data);
                },
            },
            list:       {
                outputOption: 1,
            }
        };

        this.mapping = {
            ntc_idx:    { read:     ['bind', 'output'],     update:  'bind',               delete:     ['valid', 'bind'] },
            title:      { read:     'output',               update:  ['valid', 'bind'], },
            contents:   { read:     'output',               update:  'bind' },
            top_yn:     { read:     'output',               update:  ['valid', 'bind'], },
            active_cd:  { read:     'output',               update:  ['valid', 'bind'], },
            create_dt:  { read:     'output' },
        };
    }    
}