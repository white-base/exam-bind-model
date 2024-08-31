class BaseNoticeService {
    constructor(_SUFF = '') {
        var _this = this;    

        this.items = {
            // valid, bind, output
            ntc_idx:    '',
            title:      '',
            contents:   '',
            top_yn:     '',
            active_cd:  '',
            create_dt:  ''
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