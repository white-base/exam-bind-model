import BindModel from 'https://unpkg.com/logic-bind-model/dist/bind-model.esm.js';
import NoticeFrontService from './service/notice-front-svc.js';
import { PageView } from './js/page-view.js';

const bm = new BindModel(new NoticeFrontService());
const pager = new PageView('#pagination', 10, 5);
var _template = null; // Handlebars template

bm.url = './data/list.json'; // base url

// 'list' command callabck defined
bm.cmd['list'].cbOutput = function (outs, cmd, res) {
  if (_template === null) {
    _template = Handlebars.compile(bm.columns['_area_temp'].value);
  }
  bm.columns['_area_tbody'].value = _template(outs[0].rows);

  // event register
  document.getElementById('area-tbody').addEventListener('click', function (e) {
    const target = e.target.closest('.btnNormal');
    if (target && target.dataset.index) {
      const index = parseInt(target.dataset.index, 10);
      if (!isNaN(index)) {
        cmd._model.fn.procRead(index);
      }
    }
  });
};

// move() callback function defined
pager.callback = async function (pageCount) {
  bm.cols['page_count'].value = pageCount;
  await bm.cmd['list'].exec();
  this.row_total = bm.cols['row_total'].value;
};

$('#btn_List').click(() => bm.cmd['list'].execute());
$('#btn_Search').click(() => bm.cmd['list'].execute());

$(document).ready(function () {
  bm.init();
  pager.move(1);

  console.log(10);
});
