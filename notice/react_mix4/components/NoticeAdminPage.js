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
    this.handleList();
  }

  handleList = async () => {
    await this.bm.cmd['list'].execute();
    if (this.bm.cmd['list'].state > 0) this.setState({ selectedNotice: null });
  };

  handleDelete = async () => {
    await this.bm.cmd['delete'].execute();
    if (this.bm.cmd['delete'].state > 0) this.handleList();
  };
  
  handleRead = async (idx) => {
    this.bm.cmd['read'].outputOption.index = Number(idx);
    await this.bm.cmd['read'].execute();
    // await this.bm.fn.execRead(idx);
    if (this.bm.cmd['read'].state > 0) this.setState({ selectedNotice: true });
  };

  handleChange = (e) => {
    let { name, value, type, checked } = e.target;
    if (type === 'checkbox') value = checked ? 'Y' : 'N';
    this.bm.cols[name].value = value;  //  column value setting
    this.forceUpdate();           //  Forced screen rendering
  };

  render() {
    const { selectedNotice } = this.state;
    const tag = React.createElement;

    return (
      tag('div', { className: 'container mt-3' },
        tag('h2', null, 'Notice Admin Page'),
        tag('h5', null, 'Key Features: List inquiry/modification/deletion'),
        tag('p', null, 'Data is transmitted when modified or deleted from the test page, but it is not actually processed.'),
        
        tag(NoticeList, { 
          bindModel: this.bm, 
          handleRead: this.handleRead 
        }),
        !selectedNotice || (
          tag(NoticeForm, {
            bindModel: this.bm,
            handleChange: this.handleChange,
            handleList: this.handleList,
            handleDelete: this.handleDelete,
            handleUpdate: this.handleUpdate
          })
        )
      )
    );
  }
}