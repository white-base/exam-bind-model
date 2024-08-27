class BaseService {

    constructor(){}
    
    cbFail = function(p_result, p_item) {          // 전역 실패 콜백
        console.warn("실패 :: Value=\"%s\", Code=\"%s\", Message=\"%s\" ", p_result.value, p_result.code, p_result.msg);
        Msg("ALERT", "실패", p_result.msg);
    };
    
    cbError = function(p_msg, p_status) {          // 전역 오류 콜백
        console.warn("오류 :: Status=\"%s\" , Message=\"%s\" ", p_status, p_msg);
        Msg("ALERT", "오류", p_msg);
    };
}
