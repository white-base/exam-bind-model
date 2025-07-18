
// import React from 'https://esm.sh/react';
// import ReactDOM from 'https://esm.sh/react-dom';
// import NoticeAdminPage from './components/NoticeAdminPage.js';

// function App() {
//   return React.createElement(NoticeAdminPage);
// }

// ReactDOM.render(
//   React.createElement(App),
//   document.getElementById('root')
// );

import React from 'https://esm.sh/react';
import { createRoot } from 'https://esm.sh/react-dom/client';
import NoticeAdminPage from './components/NoticeAdminPage.js';

function App() {
  return React.createElement(NoticeAdminPage);
}

const container = document.getElementById('root');
const root = createRoot(container); // v18 방식
root.render(React.createElement(App));