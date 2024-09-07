export default class NoticeAdminService {
    constructor(reactThis) {
        const _this = this;

        this.items = {
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
                cbEnd(status, cmd, res)  {
                    if (res) {
                      alert('The post has been modified.');
                      reactThis.handleList();
                    }
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
                    if (res) {
                      alert('The post has been deleted.');
                      reactThis.handleList();
                    }
                  }
            },
            list:       {
                outputOption: 1,
                cbEnd(status, cmd, res) {
                    reactThis.setState({ selectedNotice: null });
                }
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
        this.fn = {
            handleRead: async (idx) => {
                _this.bindModel.cmd['read'].outputOption.index = Number(idx);
                await _this.bindModel.cmd['read'].execute();
                reactThis.setState({ selectedNotice: true });
            },
        };
    }    
}