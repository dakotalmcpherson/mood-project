import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';

import { Provider } from 'react-redux';
import store from './store';

import { logCreator } from './App';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import '../public/style.scss';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <Provider store={store}>
      <App />
  </Provider>
);
