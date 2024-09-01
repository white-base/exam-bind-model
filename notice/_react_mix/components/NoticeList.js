// import React from 'https://esm.sh/react';

export default function NoticeList({ notices, handleRead, bm }) {
  const rows = bm.cmd.list.output.rows;
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

        rows.count > 0 ? (
          // POINT:
          rows.map((notice, i) => (
            React.createElement('tr', { key: notice.ntc_idx },
              React.createElement('td', null,
                React.createElement('a', { href: '#!', onClick: () => handleRead(notice, i), className: 'btnNormal' },
                // React.createElement('a', { href: '#!', onClick: () => {bm.fn.procRead(i)}, className: 'btnNormal' },
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