import React from 'https://esm.sh/react';

import NoticeList from './NoticeList.js';
import NoticeForm from './NoticeForm.js';

// POINT:
import NoticeAdminService from '../service/notice-admin-svc.js'
const bm = new _L.BindModel(new NoticeAdminService());  
bm.url = '/notice/data/list.json';

const { useState, useEffect } = React;

export default function NoticeAdminPage() {
  
  // POINT: 축소 가능
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    contents: '',
    active_cd: 'D',
    top_yn: false,
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    await bm.cmd['list'].execute();
    setNotices(bm.cmd.list.output.rows);

    // try {
    //   const response = await axios.get('/notice/data/list.json');
    //   setNotices(response.data.rows);
    // } catch (error) {
    //   console.error('Failed to fetch notices:', error);
    // }
  };

  const handleRead = async (notice, idx) => {
    setSelectedNotice(notice);
    
    bm.items._index = idx;
    await bm.command['read'].execute();
    
    // REVIEW: 요약 대상
    // setFormData({ 
    //   title: bm.cols.title.value,
    //   contents: bm.cols.contents.value || '',
    //   active_cd: bm.cols.active_cd.value || 'D',
    //   top_yn: bm.cols.top_yn.value === 'Y',
    // });

    // setFormData({
    //   title: notice.title,
    //   contents: notice.contents || '',
    //   active_cd: notice.active_cd || 'D',
    //   top_yn: notice.top_yn === 'Y',
    // });
  };

  const handleList = () => {
    setSelectedNotice(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    bm.cols[name].value = value;
    // setFormData((prevFormData) => ({
    //   ...prevFormData,
    //   [name]: type === 'checkbox' ? checked : value,
    // }));
    
  };

  const handleUpdate = async () => {
    
    // POINT: 축소 가능
    // bm.cols.ntc_idx.value = formData.ntc_idx;
    // bm.cols.title.value = formData.title;
    // bm.cols.contents.value = formData.contents;
    // bm.cols.active_cd.value = formData.active_cd;
    // bm.cols.top_yn.value = formData.top_yn;
    // POINT:
    await bm.cmd['update'].execute();

    // if (!formData.title.trim()) {
    //   alert('Title is required.');
    //   return;
    // }

    // try {
    //   const response = await axios.put(`data/list/${selectedNotice.ntc_idx}`, formData);
    //   console.log('Notice updated successfully:', response.data);
    //   fetchNotices();
    //   setSelectedNotice(null);
    // } catch (error) {
    //   console.error('Failed to update notice:', error);
    // }
  };

  const handleDelete = async () => {
    // POINT:
    await bm.cmd['delete'].execute();

    // try {
    //   const response = await axios.delete(`data/list/${selectedNotice.ntc_idx}`);
    //   console.log('Notice deleted successfully:', response.data);
    //   fetchNotices();
    //   setSelectedNotice(null);
    // } catch (error) {
    //   console.error('Failed to delete notice:', error);
    // }
  };

  return (
    React.createElement('div', { className: 'container mt-3' },
      React.createElement('h2', null, 'Notice Admin Page'),
      React.createElement('h5', null, 'Key Features: List inquiry/modification/deletion'),
      React.createElement('p', null, 'Data is transmitted when modified or deleted from the test page, but it is not actually processed.'),
      
      !selectedNotice ? (
        React.createElement(NoticeList, { notices, handleRead, bm })
      ) : (
        React.createElement(NoticeForm, {
          selectedNotice,
          formData,
          handleChange,
          handleUpdate,
          handleDelete,
          handleList,
          bm
        })
      )
    )
  );
}