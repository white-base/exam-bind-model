import React, { Component } from 'https://esm.sh/react';
import NoticeList from './NoticeList.js';
import NoticeForm from './NoticeForm.js';
import NoticeAdminService from '../service/notice-admin-svc.js'

export default class NoticeAdminPage extends Component {
  constructor(props) {
    super(props);
    
    this.bm = new _L.BindModel(new NoticeAdminService(this));  
    this.bm.url = '/notice/data/list.json';
      
    this.state = { selectedNotice: null };
  }

  componentDidMount() {
    this.bm.cmd['list'].execute();
  }

  handleList = () => {
    this.setState({ selectedNotice: null });
  };

  handleChange = (e) => {
    let { name, value, type, checked } = e.target;
    if (type === 'checkbox') value = checked ? 'Y' : 'N';
    this.bm.cols[name].value = value;  //  column value setting
    this.forceUpdate();           //  Forced screen rendering
  };

  render() {
    const { selectedNotice } = this.state;

    return (
      React.createElement('div', { className: 'container mt-3' },
        React.createElement('h2', null, 'Notice Admin Page'),
        React.createElement('h5', null, 'Key Features: List inquiry/modification/deletion'),
        React.createElement('p', null, 'Data is transmitted when modified or deleted from the test page, but it is not actually processed.'),
        
        React.createElement(NoticeList, { bindModel: this.bm }),
        !selectedNotice || (
          React.createElement(NoticeForm, {
            handleChange: this.handleChange,
            bindModel: this.bm
          })
        )
      )
    );
  }
}