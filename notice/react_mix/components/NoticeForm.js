// import React from 'https://esm.sh/react';

export default function NoticeForm({ selectedNotice, formData, handleChange, handleUpdate, handleDelete, handleList, bm }) {
  return (
    React.createElement('div', { id: 'class-form' },
      React.createElement('form', null,
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'create_dt' }, '날짜'),
          React.createElement('p', { id: 'create_dt' }, selectedNotice.create_dt)
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'title' }, 'Title'),
          React.createElement('input', {
            type: 'text',
            className: 'form-control',
            id: 'title',
            name: 'title',
            value: formData.title,
            onChange: handleChange
          })
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'contents' }, 'Content'),
          React.createElement('textarea', {
            className: 'form-control',
            id: 'contents',
            name: 'contents',
            rows: '3',
            value: formData.contents,
            onChange: handleChange
          })
        ),
        React.createElement('div', { className: 'row' },
          React.createElement('div', { className: 'col' },
            React.createElement('div', { className: 'form-check' },
              React.createElement('input', {
                type: 'checkbox',
                className: 'form-check-input',
                id: 'check1',
                name: 'top_yn',
                checked: formData.top_yn,
                onChange: handleChange
              }),
              React.createElement('label', { className: 'form-check-label', htmlFor: 'check1' }, 'top notice')
            )
          ),
          React.createElement('div', { className: 'col' },
            ['D', 'A', 'H'].map(value => (
              React.createElement('div', { className: 'form-check', key: value },
                React.createElement('input', {
                  type: 'radio',
                  className: 'form-check-input',
                  id: `radio${value}`,
                  name: 'active_cd',
                  value: value,
                  checked: formData.active_cd === value,
                  onChange: handleChange
                }),
                React.createElement('label', { className: 'form-check-label', htmlFor: `radio${value}` },
                  value === 'D' ? 'Standby' : value === 'A' ? 'Activation' : 'Hidden'
                )
              )
            ))
          )
        )
      ),
      React.createElement('button', { type: 'button', className: 'btn btn-primary mt-3', onClick: handleUpdate }, 'Update'),
      React.createElement('button', { type: 'button', className: 'btn btn-primary mt-3', onClick: handleDelete }, 'Delete'),
      React.createElement('button', { type: 'button', className: 'btn btn-primary mt-3', onClick: handleList }, 'List')
    )
  );
}