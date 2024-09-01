import React, { Component } from 'https://esm.sh/react';
import NoticeList from './NoticeList.js';
import NoticeForm from './NoticeForm.js';
// import axios from 'axios'; // Assuming axios is used based on your fetch logic
// POINT:
import NoticeAdminService from '../service/notice-admin-svc.js'
const bm = new _L.BindModel(new NoticeAdminService());  

export default class NoticeAdminPage extends Component {
  constructor(props) {
    super(props);
    // POINT:
    this.state = {
      selectedNotice: null,
    };

    // this.state = {
    //   notices: [],
    //   selectedNotice: null,
    //   formData: {
    //     title: '',
    //     contents: '',
    //     active_cd: 'D',
    //     top_yn: false,
    //   },
    // };

    
    bm.url = '/notice/data/list.json';
  }

  componentDidMount() {
    this.fetchNotices();
  }

  fetchNotices = async () => {
    // POINT:
    await bm.cmd['list'].execute();
    this.forceUpdateComponent();
    
    // try {
    //   const response = await axios.get('/notice/data/list.json');
    //   this.setState({ notices: response.data.rows });
    // } catch (error) {
    //   console.error('Failed to fetch notices:', error);
    // }
  };

  handleRead = async (notice, idx) => {
    // POINT:
    bm.items._index = idx;
    await bm.command['read'].execute();
    this.setState({
      selectedNotice: notice,
    });
    // this.forceUpdateComponent();
    // this.setState({
    //   selectedNotice: notice,
    //   formData: {
    //     title: notice.title,
    //     contents: notice.contents || '',
    //     active_cd: notice.active_cd || 'D',
    //     top_yn: notice.top_yn === 'Y',
    //   },
    // });
  };

  handleList = () => {
    this.setState({ selectedNotice: null });
  };

  handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    bm.cols[name].value = value;
    this.forceUpdateComponent();

    // this.setState((prevState) => ({
    //   formData: {
    //     ...prevState.formData,
    //     [name]: type === 'checkbox' ? checked : value,
    //   },
    // }));
  };

  handleUpdate = async () => {
    // POINT:
    var _this = this;
    await bm.cmd['update'].execute();
    bm.cmd['update'].cbEnd = function(status, cmd, res) {
      if (res) {
        alert('The post has been modified.');
        _this.handleList(); // 이동
      }
    }
    // this.handleList();

    // const { selectedNotice, formData } = this.state;

    // if (!formData.title.trim()) {
    //   alert('Title is required.');
    //   return;
    // }

    // try {
    //   const response = await axios.put(`data/list/${selectedNotice.ntc_idx}`, formData);
    //   console.log('Notice updated successfully:', response.data);
    //   this.fetchNotices();
    //   this.setState({ selectedNotice: null });
    // } catch (error) {
    //   console.error('Failed to update notice:', error);
    // }
  };

  handleDelete = async () => {
    // POINT:
    var _this = this;
    await bm.cmd['delete'].execute();
    bm.cmd['delete'].cbEnd = function(status, cmd, res) {
      if (res) {
        alert('The post has been deleted.');
        _this.handleList(); // 이동
      }
    }

    // const { selectedNotice } = this.state;

    // try {
    //   const response = await axios.delete(`data/list/${selectedNotice.ntc_idx}`);
    //   console.log('Notice deleted successfully:', response.data);
    //   this.fetchNotices();
    //   this.setState({ selectedNotice: null });
    // } catch (error) {
    //   console.error('Failed to delete notice:', error);
    // }
  };

  forceUpdateComponent = () => {
    this.forceUpdate(); // This will force a re-render of the component
  };

  render() {
    const { notices, selectedNotice, formData } = this.state;

    return (
      React.createElement('div', { className: 'container mt-3' },
        React.createElement('h2', null, 'Notice Admin Page'),
        React.createElement('h5', null, 'Key Features: List inquiry/modification/deletion'),
        React.createElement('p', null, 'Data is transmitted when modified or deleted from the test page, but it is not actually processed.'),
        
        !selectedNotice ? (
          React.createElement(NoticeList, { notices, handleRead: this.handleRead, bm })
        ) : (
          React.createElement(NoticeForm, {
            selectedNotice,
            formData,
            handleChange: this.handleChange,
            handleUpdate: this.handleUpdate,
            handleDelete: this.handleDelete,
            handleList: this.handleList,
            bm
          })
        )
      )
    );
  }
}