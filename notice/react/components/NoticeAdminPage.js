import React from 'https://esm.sh/react';

import NoticeList from './NoticeList.js';
import NoticeForm from './NoticeForm.js';

const { useState, useEffect } = React;

export default function NoticeAdminPage() {
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
    try {
      const response = await axios.get('/notice/data/list.json');
      setNotices(response.data.rows);
    } catch (error) {
      console.error('Failed to fetch notices:', error);
    }
  };

  const handleRead = (notice) => {
    setSelectedNotice(notice);
    setFormData({
      title: notice.title,
      contents: notice.contents || '',
      active_cd: notice.active_cd || 'D',
      top_yn: notice.top_yn === 'Y',
    });
  };

  const handleList = () => {
    setSelectedNotice(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdate = async () => {
    if (!formData.title.trim()) {
      alert('Title is required.');
      return;
    }

    try {
      const response = await axios.put(`data/list/${selectedNotice.ntc_idx}`, formData);
      console.log('Notice updated successfully:', response.data);
      fetchNotices();
      setSelectedNotice(null);
    } catch (error) {
      console.error('Failed to update notice:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`data/list/${selectedNotice.ntc_idx}`);
      console.log('Notice deleted successfully:', response.data);
      fetchNotices();
      setSelectedNotice(null);
    } catch (error) {
      console.error('Failed to delete notice:', error);
    }
  };

  return (
    React.createElement('div', { className: 'container mt-3' },
      React.createElement('h2', null, 'Notice Admin Page'),
      React.createElement('h5', null, 'Key Features: List inquiry/modification/deletion'),
      React.createElement('p', null, 'Data is transmitted when modified or deleted from the test page, but it is not actually processed.'),
      
      !selectedNotice ? (
        React.createElement(NoticeList, { notices, handleRead })
      ) : (
        React.createElement(NoticeForm, {
          selectedNotice,
          formData,
          handleChange,
          handleUpdate,
          handleDelete,
          handleList
        })
      )
    )
  );
}