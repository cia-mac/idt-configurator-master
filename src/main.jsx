import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/idt-configurator-live/sw.js').catch(() => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  });
}
