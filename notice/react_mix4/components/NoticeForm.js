import React, { Component } from 'https://esm.sh/react';

export default class NoticeForm extends Component {
  render() {
    const { bindModel: bm } = this.props;
    const { handleChange, handleDelete, handleList, handleUpdate } = this.props;
    const tag = React.createElement;

    return (
      tag('div', { id: 'class-form' },
        tag('form', null,
          tag('div', { className: 'form-group' },
            tag('label', {}, '날짜'),
            tag('p', { id: 'create_dt' }, bm.cols['create_dt'].value)
          ),
          tag('div', { className: 'form-group' },
            tag('label', { htmlFor: 'title' }, 'Title'),
            tag('input', {
              type: 'text',
              className: 'form-control',
              id: 'title',
              name: 'title',
              value: bm.cols['title'].value,
              onChange: handleChange
            })
          ),
          tag('div', { className: 'form-group' },
            tag('label', { htmlFor: 'contents' }, 'Content'),
            tag('textarea', {
              className: 'form-control',
              id: 'contents',
              name: 'contents',
              rows: '3',
              value: bm.cols['contents'].value,
              onChange: handleChange
            })
          ),
          tag('div', { className: 'row' },
            tag('div', { className: 'col' },
              tag('div', { className: 'form-check' },
                tag('input', {
                  type: 'checkbox',
                  className: 'form-check-input',
                  id: 'check1',
                  name: 'top_yn',
                  checked: bm.cols['top_yn'].value === 'Y',
                  onChange: handleChange
                }),
                tag('label', { className: 'form-check-label', htmlFor: 'check1' }, 'top notice')
              )
            ),
            tag('div', { className: 'col' },
              ['D', 'A', 'H'].map(value => (
                tag('div', { className: 'form-check', key: value },
                  tag('input', {
                    type: 'radio',
                    className: 'form-check-input',
                    id: `radio${value}`,
                    name: 'active_cd',
                    value: value,
                    checked: bm.cols['active_cd'].value === value,
                    onChange: handleChange
                  }),
                  tag('label', { className: 'form-check-label', htmlFor: `radio${value}` },
                    value === 'D' ? 'Standby' : value === 'A' ? 'Activation' : 'Hidden'
                  )
                )
              ))
            )
          )
        ),
        tag('button', { type: 'button', className: 'btn btn-primary mt-3', onClick: handleUpdate }, 'Update'),
        tag('button', { type: 'button', className: 'btn btn-primary mt-3', onClick: handleDelete }, 'Delete'),
        tag('button', { type: 'button', className: 'btn btn-primary mt-3', onClick: handleList }, 'List')
      )
    );
  }
}