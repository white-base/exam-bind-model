import BindModel from 'https://unpkg.com/logic-bind-model/dist/bind-model.esm.js';
import NoticeFrontService from './service/notice-front-svc.js';
import { PageView } from './js/page-view.js';

const bm = new BindModel(new NoticeFrontService());
const pager = new PageView('#pagination', 5, 3);

bm.url = './data/list.json'; // base url

// 콜백 함수 정의
bm.columns['page_size' ].getter = () => pager.page_size;
bm.columns['page_count'].getter = () => pager.page_count;

// move() callback function defined
pager.callback = async function (pageCount) {
  pager.page_count = pageCount;
  await bm.command['list'].execute();
  this.row_total = bm.columns['row_total'].value;
};

$('#btn_Search').click(() => pager.move(1));

$(document).ready(function () {
  pager.move(1);
});
