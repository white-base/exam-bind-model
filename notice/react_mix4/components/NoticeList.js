import React, { Component } from 'https://esm.sh/react';

export default class NoticeList extends Component {
  render() {
    const { bindModel: bm, handleRead } = this.props;
    const rows = bm.cmd.list.output.rows;
    const tag = React.createElement;

    return (
      tag('table', { className: 'table' },
        tag('thead', null,
          tag('tr', null,
            tag('th', null, 'Title'),
            tag('th', null, 'Status'),
            tag('th', null, 'Date')
          )
        ),
        tag('tbody', null,
          rows.count > 0 ? (
            rows.map((notice, i) => (
              tag('tr', { key: notice.ntc_idx },
                tag('td', null,
                  tag('a', { href: '#', onClick: () => handleRead(i), className: 'btnNormal' },
                    notice.title
                  )
                ),
                tag('td', null, notice.active_cd),
                tag('td', null, notice.create_dt)
              )
            ))
          ) : (
            tag('tr', null,
              tag('td', { colSpan: '3' }, 'There is no content.')
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