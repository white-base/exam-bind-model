import BindModel from 'https://unpkg.com/logic-bind-model/dist/bind-model.esm.js';
import ListService from './service.js';

// function hasVerticalScrollbar() {
//   return document.documentElement.scrollHeight > document.documentElement.clientHeight;
// }

// function isLastPage() {
//   var page = bm.cols['page_count'].value;
//   var pageSize = bm.cols['page_size'].value;
//   var rowTotal = bm.cols['row_total'].value;
//   return page * pageSize >= rowTotal;
// }

const bm1 = new BindModel(new ListService('-s1'));
const bm2 = new BindModel(new ListService('-s2'));

// window.addEventListener('scroll', function () {
//   var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
//   var windowHeight = window.innerHeight;
//   var documentHeight = document.documentElement.scrollHeight;

//   if (scrollTop + windowHeight >= documentHeight - 50 || hasVerticalScrollbar()) {
//     if (isLastPage()) {
//       console.warn('No more data to load.');
//       return;
//     }
//     bm.cols['page_count'].value += 1;
//     bm.cmd['list'].execute();
//   }
// });

// $(document).on('click', '.sortable', function () {
//   var sortKey = $(this).data('sort');
//   var sortable = bm.cols['sortable'].value;
  
//   bm.cols['sortable'].value = sortable === 'asc' ? 'desc' : 'asc';
//   bm.cols['sort_column'].value = sortKey;
//   bm.fn.procReset();
//   bm.cmd['list'].execute();
// });

// bm.cmd['list'].cbEnd = function (status, cmd, res) {
//   if (!hasVerticalScrollbar() && !isLastPage()) {
//     bm.cols['page_count'].value += 1;
//     bm.cmd['list'].execute();
//   } 
// };

$(document).ready(function () {
  bm1.cmd['list'].execute('ALL', './data/one.json');
  bm2.cmd['list'].execute('ALL', './data/two.json');
});