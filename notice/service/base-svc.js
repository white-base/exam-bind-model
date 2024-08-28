class BaseService {

    constructor(_SUFF = ''){

        this.cbFail = function(p_result, p_item) {          // 전역 실패 콜백
            console.warn("실패 :: Value=\"%s\", Code=\"%s\", Message=\"%s\" ", p_result.value, p_result.code, p_result.msg);
            alert('valid 검사가 실패하였습니다.')
        };
        
        this.cbError = function(p_msg, p_status) {          // 전역 오류 콜백
            console.error("오류 :: Status=\"%s\" , Message=\"%s\" ", p_status, p_msg);
            alert('오류가 발생하였습니다.');
        };
    }
}
