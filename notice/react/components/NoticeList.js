// import {React} from './react.js';
import React from 'https://esm.sh/react';

export default function NoticeList({ notices, handleRead }) {
  return (
    React.createElement('table', { className: 'table' },
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', null, 'Title'),
          React.createElement('th', null, 'Status'),
          React.createElement('th', null, 'Date')
        )
      ),
      React.createElement('tbody', null,
        notices.length > 0 ? (
          notices.map(notice => (
            React.createElement('tr', { key: notice.ntc_idx },
              React.createElement('td', null,
                React.createElement('a', { href: '#!', onClick: () => handleRead(notice), className: 'btnNormal' },
                  notice.title
                )
              ),
              React.createElement('td', null, notice.active_cd),
              React.createElement('td', null, notice.create_dt)
            )
          ))
        ) : (
          React.createElement('tr', null,
            React.createElement('td', { colSpan: '3' }, 'There is no content.')
          )
        )
      )
    )
  );
}