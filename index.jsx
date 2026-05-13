import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './components/Style/theme.css';
import App from './App';
import './i18n';
import { routerFuture } from './routerFuture';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter future={routerFuture}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
