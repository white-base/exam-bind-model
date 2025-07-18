import BindModel from 'https://unpkg.com/logic-bind-model/dist/bind-model.esm.js';
import NoticeFrontService from './service/notice-front-svc.js'

var bm = new BindModel(new NoticeFrontService());

bm.url = '/notice/data/list.json';  // base url

// event handlers
$('#btn_List').click(()=> bm.cmd['list'].execute());

$(document).ready(function () {
    bm.init();
    bm.cmd['list'].execute();
});