
import React from 'https://esm.sh/react';
import ReactDOM from 'https://esm.sh/react-dom';
import NoticeAdminPage from './components/NoticeAdminPage.js';

function App() {
  return React.createElement(NoticeAdminPage);
}

ReactDOM.render(
  React.createElement(App),
  document.getElementById('root')
);