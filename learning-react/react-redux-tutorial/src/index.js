// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import rootReducer from './modules/index.js';
// import { createStore } from 'redux';
// import { Provider } from 'react-redux';
// import { composeWithDevTools } from '@redux-devtools/extension';

// const store = createStore(rootReducer, composeWithDevTools);

// ReactDOM.render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   document.getElementById('root'),
// );
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import './index.css';
import App from './App';
import rootReducer from './modules';


const store = createStore(rootReducer, composeWithDevTools());
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  </React.StrictMode>
);