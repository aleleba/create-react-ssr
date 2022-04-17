import React from 'react';
import { createRoot } from 'react-dom/client';
//Router
import { BrowserRouter as Router } from 'react-router-dom';
//History
import { createBrowserHistory } from 'history';
import App from './components/App';
import './styles/global.sass';

const container = document.getElementById('app');
const root = createRoot(container);
const history = createBrowserHistory()

root.render(
    <Router history={history}>
        <App tab="home" />
    </Router>
);

if (module.hot) {
    module.hot.accept();
}