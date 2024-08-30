class BaseService {

    constructor(_SUFF = ''){

        this.cbFail = function(p_result, p_item) {          // 전역 실패 콜백
            console.warn("Fail :: Value=\"%s\", Code=\"%s\", Message=\"%s\" ", p_result.value, p_result.code, p_result.msg);
            alert('Validation failed for "valid".')
        };
        
        this.cbError = function(p_msg, p_status) {          // 전역 오류 콜백
            console.error("Error :: Status=\"%s\" , Message=\"%s\" ", p_status, p_msg);
            alert('An error has occurred.');
        };
    }
}

export {
    BaseService as default,
    BaseService
}