import BindModel from 'https://unpkg.com/logic-bind-model/dist/bind-model.esm.js';
import NoticeFrontService from './service/list-svc.js';

const bm = new BindModel(new NoticeFrontService());
var _template = null; // Handlebars template

// scroll event handler
window.addEventListener('scroll', function () {
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  var windowHeight = window.innerHeight;
  var documentHeight = document.documentElement.scrollHeight;

  if (scrollTop + windowHeight >= documentHeight - 50 || hasVerticalScrollbar()) {
    var page = bm.cols['page_count'].value;
    var rowTotal = bm.cols['row_total'].value;
    var pageSize = bm.cols['page_size'].value;
    
    if (page * pageSize >= rowTotal) {
      console.warn('No more data to load.');
      return;
    }
    bm.cols['page_count'].value += 1; // page increment
    bm.cmd['list'].execute();
  }
});

bm.cmd['list'].cbEnd = function (status, cmd, res) {
  if (!hasVerticalScrollbar()) {
    bm.cols['page_count'].value += 1; // page increment
    bm.cmd['list'].execute();
  } 
};

$(document).ready(function () {
  bm.cmd['list'].execute();
});

function hasVerticalScrollbar() {
  return document.documentElement.scrollHeight > window.innerHeight;
}