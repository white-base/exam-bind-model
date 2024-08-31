// import React from 'https://esm.sh/react';

export default function NoticeList({ notices, handleRead, bm }) {
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
          (() => {
            // POINT:
            // console.log("IIFE");
            bm.cmd.list.output.rows.map = function(callbackFn) {
              var arr = [];              
              for (var i = 0; i < this.count; i++) { 
                 /* call the callback function for every value of this array and       push the returned value into our resulting array
                 */
                arr.push(callbackFn(this[i], i, this));
              }
              return arr;
            }
            var rows = bm.cmd.list.output.rows;
            return rows.map(notice => (
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
          })()
          // notices.map(notice => (
          //   React.createElement('tr', { key: notice.ntc_idx },
          //     React.createElement('td', null,
          //       React.createElement('a', { href: '#!', onClick: () => handleRead(notice), className: 'btnNormal' },
          //         notice.title
          //       )
          //     ),
          //     React.createElement('td', null, notice.active_cd),
          //     React.createElement('td', null, notice.create_dt)
          //   )
          // ))
        ) : (
          React.createElement('tr', null,
            React.createElement('td', { colSpan: '3' }, 'There is no content.')
          )
        )
      )
    )
  );
}