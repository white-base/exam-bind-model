import React, { Component } from 'https://esm.sh/react';

export default class NoticeList extends Component {
  render() {
    const { handleRead, bindModel } = this.props;
    const rows = bindModel.cmd.list.output.rows;

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
            rows.map((notice, i) => (
              React.createElement('tr', { key: notice.ntc_idx },
                React.createElement('td', null,
                  React.createElement('a', { href: '#', onClick: () => handleRead(i), className: 'btnNormal' },
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
    // return (
    //   <table className="table">
    //     <thead>
    //       <tr>
    //         <th>Title</th>
    //         <th>Status</th>
    //         <th>Date</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {notices.length > 0 ? (
    //         notices.map(notice => (
    //           <tr key={notice.ntc_idx}>
    //             <td>
    //               <a href="#!" onClick={() => handleRead(notice)} className="btnNormal">
    //                 {notice.title}
    //               </a>
    //             </td>
    //             <td>{notice.active_cd}</td>
    //             <td>{notice.create_dt}</td>
    //           </tr>
    //         ))
    //       ) : (
    //         <tr>
    //           <td colSpan="3">There is no content.</td>
    //         </tr>
    //       )}
    //     </tbody>
    //   </table>
    // );
  }
}