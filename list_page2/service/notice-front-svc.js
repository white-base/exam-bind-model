class NoticeFrontService {
  constructor(_SUFF = '') {
    var _this = this;
    var _template = null; // Handlebars template

    this.items = {
      // misc
      _area_temp:   { selector: { key: `#area-temp${_SUFF}`,  type: 'html' } },
      _area_tbody:  { selector: { key: `#area-tbody${_SUFF}`, type: 'html' } },
      row_total: 0,
      // bind
      keyword:      { selector: { key: `#keyword${_SUFF}`,    type: 'value' } },
      page_size: 10,
      page_count: 1,
    };

    this.command = {
      list: {
        outputOption: 'ALL',
        cbBind(bind, cmd, setup) {
          console.warn(
            'Caution: Send to the test server, but the data is not reflected.',
            setup.data
          );
        },
        cbResult(data, cmd, res) {
          cmd._model.cols['row_total'].value = data.row_total; // Update row_total
        },
        cbOutput(outs, cmd, res) {
          // Processing from the client arbitrarily without fetching pages from the server !!
          var page_size   = _this.bindModel.columns['page_size' ].value;
          var page_count  = _this.bindModel.columns['page_count'].value;
          var start_idx = (page_count - 1) * page_size;
          var view = outs[0].copy((row, idx, entity) => idx >= start_idx && idx < start_idx + page_size);

          if (_template === null) {
            _template = Handlebars.compile(_this.bindModel.columns['_area_temp'].value);
          }
          _this.bindModel.columns['_area_tbody'].value = _template(view.rows);
        }
      },
    };

    this.mapping = {
      _area_temp:   { list: 'misc' },
      _area_tbody:  { list: 'misc' },
      row_total:    { list: 'misc' },
      page_size:    { list: 'bind' },
      page_count:   { list: 'bind' },
      keyword:      { list: 'bind' },
    };
  }
}

export { NoticeFrontService as default, NoticeFrontService };
