export default class NoticeAdminService {
    constructor() {
        const _this = this;

        this.items = {
            ntc_idx: { required: true },
            title: { required: true }
        },

        this.command = {
            read:       {
                outputOption: 'VIEW',
            },
            update:     {
                cbBind(bind, cmd, setup) {
                    console.warn('Caution: Send to the test server, but the data is not reflected.', setup.data);
                },
                cbEnd(status, cmd, res)  {
                    if (res) alert('The post has been modified.');
                }
            },
            delete:     {
                cbValid(valid, cmd) { 
                    if (confirm('Are you sure you want to delete it?')) return true;
                },
                cbBind(bind, cmd, setup) {
                    console.warn('Caution: Send to the test server, but the data is not reflected.', setup.data);
                },
                cbEnd(status, cmd, res) {
                    if (res) alert('The post has been deleted.');
                }
            },
            list:       {
                outputOption: "ALL",
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

        // this.fn = {
        //     execRead: (idx) => {
        //         _this.bindModel.cmd['read'].outputOption.index = Number(idx);
        //         return _this.bindModel.cmd['read'].execute();
        //     },
        // };
    }    
}