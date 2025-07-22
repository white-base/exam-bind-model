import BindModel from 'https://unpkg.com/logic-bind-model/dist/bind-model.esm.js';
import NoticeAdminService from './service/notice-admin-svc.js'

var bm = new BindModel(new NoticeAdminService());

bm.url = '/notice/data/list.json';  // base url

// event handlers
$('#btn_Update').click(()=> bm.cmd['update'].exec());
$('#btn_Delete').click(()=> bm.cmd['delete'].exec());
$('#btn_List').click(()=> bm.cmd['list'].exec());

$(document).ready(function () {
    bm.cmd['list'].exec();
});