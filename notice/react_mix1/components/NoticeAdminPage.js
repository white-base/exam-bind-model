import React, { Component } from 'https://esm.sh/react';
import NoticeList from './NoticeList.js';
import NoticeForm from './NoticeForm.js';
import NoticeAdminService from '../service/notice-admin-svc.js'

const bm = new _L.BindModel(new NoticeAdminService());  

export default class NoticeAdminPage extends Component {
  constructor(props) {
    super(props);

    // bm.cols.title.required = true;
    bm.url = '/notice/data/list.json';

    this.state = { selectedNotice: null };
  }

  componentDidMount() {
    this.fetchNotices();
  }

  fetchNotices = async () => {
    await bm.cmd['list'].execute();
    this.forceUpdate();
  };

  handleRead = async (idx) => {
    bm.items._index = idx;
    await bm.command['read'].execute();
    this.setState({ selectedNotice: true });
  };

  handleList = () => {
    this.setState({ selectedNotice: null });
  };

  handleChange = (e) => {
    let { name, value, type, checked } = e.target;
    if (type === 'checkbox') value = checked ? 'Y' : 'N';
    bm.cols[name].value = value;  //  column value 설정
    this.forceUpdate();           //  강제 화면 렌더링
  };

  handleUpdate = async () => {
    const _this = this;

    bm.cmd['update'].cbEnd = function(status, cmd, res) {
      if (res) {
        alert('The post has been modified.');
        _this.handleList();
      }
    }
    await bm.cmd['update'].execute();
  };

  handleDelete = async () => {
    const _this = this;

    bm.cmd['delete'].cbEnd = function(status, cmd, res) {
      if (res) {
        alert('The post has been deleted.');
        _this.handleList();
      }
    }
    await bm.cmd['delete'].execute();
  };

  render() {
    const { selectedNotice } = this.state;

    return (
      React.createElement('div', { className: 'container mt-3' },
        React.createElement('h2', null, 'Notice Admin Page'),
        React.createElement('h5', null, 'Key Features: List inquiry/modification/deletion'),
        React.createElement('p', null, 'Data is transmitted when modified or deleted from the test page, but it is not actually processed.'),
        
        React.createElement(NoticeList, { handleRead: this.handleRead, bindModel: bm }),
        !selectedNotice || (
          React.createElement(NoticeForm, {
            selectedNotice,
            handleChange: this.handleChange,
            handleUpdate: this.handleUpdate,
            handleDelete: this.handleDelete,
            handleList: this.handleList,
            bindModel: bm
          })
        )
      )
    );
  }
}