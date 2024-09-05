import React, { Component } from 'https://esm.sh/react';
import NoticeList from './NoticeList.js';
import NoticeForm from './NoticeForm.js';

const bm = new _L.BindModel();  

export default class NoticeAdminPage extends Component {
  constructor(props) {
    super(props);
    
    var reactThis = this;

    bm.setService({
      url: '/notice/data/list.json',
      items: {
        title: { required: true }
      },
      command: {
        read: {
            outputOption: 3,
        },
        update: {
            cbBind(bind, cmd, setup) {
                console.warn('Caution: Send to the test server, but the data is not reflected.', setup.data);
            },
            cbEnd(status, cmd, res)  {
              if (res) {
                alert('The post has been modified.');
                reactThis.handleList();
              }
            }
        },
        delete: {
            cbValid(valid, cmd) { 
                if (confirm('Are you sure you want to delete it?')) return true;
            },
            cbBind(bind, cmd, setup) {
                console.warn('Caution: Send to the test server, but the data is not reflected.', setup.data);
            },
            cbEnd(status, cmd, res) {
              if (res) {
                alert('The post has been deleted.');
                reactThis.handleList();
              }
            }
        },
        list: {
            outputOption: 1,
            cbEnd(status, cmd, res) {
              reactThis.setState({ selectedNotice: null });
            }
        }
      },
      mapping: {
        ntc_idx:    { read:     ['bind', 'output'],     update:  'bind',               delete:     'bind' },
        title:      { read:     'output',               update:  ['valid', 'bind'], },
        contents:   { read:     'output',               update:  'bind' },
        top_yn:     { read:     'output',               update:  ['valid', 'bind'], },
        active_cd:  { read:     'output',               update:  ['valid', 'bind'], },
        create_dt:  { read:     'output' },
      },
      fn: {
        handleRead: async (idx) => {
          bm.cmd['read'].outputOption.index = Number(idx);
          await bm.command['read'].execute();
          reactThis.setState({ selectedNotice: true });
        },
      }
    });

    this.state = { selectedNotice: null };
  }

  componentDidMount() {
    bm.cmd['list'].execute();
  }

  handleList = () => {
    this.setState({ selectedNotice: null });
  };

  handleChange = (e) => {
    let { name, value, type, checked } = e.target;
    if (type === 'checkbox') value = checked ? 'Y' : 'N';
    bm.cols[name].value = value;  //  column value 설정
    this.forceUpdate();           //  강제 화면 렌더링
  };

  render() {
    const { selectedNotice } = this.state;

    return (
      React.createElement('div', { className: 'container mt-3' },
        React.createElement('h2', null, 'Notice Admin Page'),
        React.createElement('h5', null, 'Key Features: List inquiry/modification/deletion'),
        React.createElement('p', null, 'Data is transmitted when modified or deleted from the test page, but it is not actually processed.'),
        
        React.createElement(NoticeList, { bindModel: bm }),
        !selectedNotice || (
          React.createElement(NoticeForm, {
            handleChange: this.handleChange,
            bindModel: bm
          })
        )
      )
    );
  }
}