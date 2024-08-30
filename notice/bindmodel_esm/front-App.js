import NoticeFrontService from './service/notice-front-svc.js'

var bm = new _L.BindModel(new NoticeFrontService());

bm.url = '/notice/data/list.json';  // base url
$('#btn_List').click(()=> bm.cmd['list'].execute());


$(document).ready(function () {
    bm.init();
    bm.cmd['list'].execute();
    window.bm = bm;         // global var
});