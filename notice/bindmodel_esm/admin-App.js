import NoticeAdminService from './service/notice-admin-svc.js'

var bm = new _L.BindModel(new NoticeAdminService());

bm.url = '/notice/data/list.json';  // base url
$('#btn_Update').click(()=> bm.cmd['update'].execute());
$('#btn_Delete').click(()=> bm.cmd['delete'].execute());
$('#btn_List').click(()=> bm.cmd['list'].execute());

$(document).ready(function () {
    bm.init();
    bm.cmd['list'].execute();
    window.bm = bm;         // global var
});