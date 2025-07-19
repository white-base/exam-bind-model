class NoticeFrontService {
  constructor(_SUFF = '') {
    var _this = this;
    var _template = null; // Handlebars template

    this.items = {
      // misc
      _area_temp: { selector: { key: `#area-temp${_SUFF}`, type: 'html' } },
      _area_tbody: { selector: { key: `#area-tbody${_SUFF}`, type: 'html' } },
      _index: 0,
      // valid, bind, output
      page_size: 10,
      page_count: 1,
      row_total: 0,
      ntc_idx: '',
    };

    this.command = {
      list: {
        outputOption: 'ALL',
        cbBegin(model, cmd) {
            var page = cmd._model.cols['page_count'].value;
            cmd.url = `/scroll_list/data/list_${page}.json`;
        },
        cbBind(bind, cmd, setup) {
            console.warn('Caution: Send to the test server, but the data is not reflected.', setup.data);
        },
        cbResult(data, cmd, res) {
          cmd._model.cols['row_total'].value = data.row_total;
        },
        cbOutput(outs, cmd, res) {
            if (_template === null) {
                _template = Handlebars.compile(cmd._model.cols['_area_temp'].value);
            }
            
            // cmd._model.cols['_area_tbody'].value += _template(outs[0].rows);
            // 성능 개선: 기존의 innerHTML 사용을 피하고 insertAdjacentHTML로 성능 향상
            document.querySelector(`#area-tbody${_SUFF}`).insertAdjacentHTML('beforeend', _template(outs[0].rows));
        },
      },
    };

    this.mapping = {
      _area_temp: { list: 'misc' },
      _area_tbody: { list: 'misc' },
      page_size: { list: 'bind' },
      page_count: { list: 'bind' },
      row_total: { list: 'misc' },
    };
  }
}

export { NoticeFrontService as default, NoticeFrontService };
