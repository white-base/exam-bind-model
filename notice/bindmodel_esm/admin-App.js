import BindModel from 'https://unpkg.com/logic-bind-model/dist/bind-model.esm.js';
import NoticeAdminService from './service/notice-admin-svc.js'

var bm = new BindModel(new NoticeAdminService());

bm.url = '/notice/data/list.json';  // base url

// event handlers
$('#btn_Update').click(()=> bm.command['update'].execute());
$('#btn_Delete').click(()=> bm.command['delete'].execute());
$('#btn_Save').click(()=> bm.command['create'].execute());
$('#btn_List').click(()=> bm.command['list'].execute());
$('#btn_From').click(()=> bm.fn.createFrom());
$('#btn_Cancel').click(()=> bm.command['list'].execute());

$(document).ready(function () {
    bm.cmd['list'].exec();
});