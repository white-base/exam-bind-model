import React, { Component } from 'https://esm.sh/react';

export default class NoticeForm extends Component {
  render() {
    const { handleChange, bindModel } = this.props;

    return (
      React.createElement('div', { id: 'class-form' },
        React.createElement('form', null,
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', {}, '날짜'),
            React.createElement('p', { id: 'create_dt' }, bindModel.cols.create_dt.value)
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { htmlFor: 'title' }, 'Title'),
            React.createElement('input', {
              type: 'text',
              className: 'form-control',
              id: 'title',
              name: 'title',
              value: bindModel.cols.title.value,
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
              value: bindModel.cols.contents.value,
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
                  checked: bindModel.cols.top_yn.value === 'Y',
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
                    checked: bindModel.cols.active_cd.value === value,
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
        React.createElement('button', { type: 'button', className: 'btn btn-primary mt-3', onClick: ()=> bindModel.cmd['update'].execute() }, 'Update'),
        React.createElement('button', { type: 'button', className: 'btn btn-primary mt-3', onClick: ()=> bindModel.cmd['delete'].execute() }, 'Delete'),
        React.createElement('button', { type: 'button', className: 'btn btn-primary mt-3', onClick: ()=> bindModel.cmd['list'].execute() }, 'List')
      )
    );
  }
}