import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import initialStateReducer from '../frontend/reducers/initialState';
import setStore from '../frontend/setStore';

const ProviderMock = ({ children, initialState }) => {
    let initialStateMock = initialStateReducer

    if(initialState !== undefined){
        initialStateMock = initialState
    }

    const history = createMemoryHistory();
    const store = setStore({ initialState: initialStateMock });

    return(
        <Provider store={store}>
            <Router location={history.location} navigator={history}>
                {children}
            </Router>
        </Provider>
    )
}

export default ProviderMock;