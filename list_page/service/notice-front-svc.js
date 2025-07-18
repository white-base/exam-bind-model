class NoticeFrontService {
  constructor(_SUFF = '') {
    var _this = this;
    var _template = null; // Handlebars template

    this.items = {
      // misc
      _area_temp: { selector: { key: `#area-temp${_SUFF}`, type: 'html' } },
      _area_tbody: { selector: { key: `#area-tbody${_SUFF}`, type: 'html' } },
      _area_form: {
        selector: { key: `#class-form${_SUFF}`, type: 'attr.class' },
      },
      _index: 0,
      // valid, bind, output
      page_size: 10,
      page_count: 1,
      row_total: 0,
      ntc_idx: '',
      keyword: { selector: { key: `#keyword${_SUFF}`, type: 'value' } },
      title: { selector: { key: `#title${_SUFF}`, type: 'value' } },
      contents: { selector: { key: `#contents${_SUFF}`, type: 'value' } },
      create_dt: { selector: { key: `#create_dt${_SUFF}`, type: 'text' } },
    };

    this.fn = {
      procRead(index) {
        _this.bindModel.items._index = index;
        _this.bindModel.command['read'].execute();
      },
    };

    this.command = {
      read: {
        outputOption: 'VIEW',
        cbBegin(model, cmd) {
          cmd.outputOption.index = Number(cmd._model.items._index);
          model.columns._area_form.value = ''; // form show
        },
      },
      list: {
        outputOption: 'ALL',
        cbBind(bind, cmd, setup) {
          cmd._model.columns._area_form.value = 'd-none';
          console.warn(
            'Caution: Send to the test server, but the data is not reflected.',
            setup.data
          );
        },
        cbResult(data, cmd, res) {
          cmd._model.cols['row_total'].value = data.row_total;
        },
      },
    };

    this.mapping = {
      _area_temp: { list: 'misc' },
      _area_tbody: { list: 'misc' },
      _area_form: { list: 'misc' },
      ntc_idx: { read: 'bind' },
      title: { read: 'output' },
      contents: { read: 'output' },
      create_dt: { read: 'output' },
      page_size: { list: 'bind' },
      page_count: { list: 'bind' },
      keyword: { list: 'bind' },
      row_total: { list: 'misc' },
    };
  }
}

export { NoticeFrontService as default, NoticeFrontService };
