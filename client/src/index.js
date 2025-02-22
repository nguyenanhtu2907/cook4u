import React from 'react';
import ReacDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';


import App from './App';
import reducers from './reducers/index';

const store = createStore(reducers, compose(applyMiddleware(thunk)))

ReacDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);