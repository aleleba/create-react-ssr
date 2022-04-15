import React from 'react';
import ReactDom from 'react-dom';
import App from './components/App';
import './styles/global.sass';

ReactDom.render(<App />, document.getElementById('app'));

if (module.hot) {
    module.hot.accept();
}