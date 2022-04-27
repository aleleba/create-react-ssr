import React from 'react';
import logo from '../logo.svg';
import './InitialComponent.sass';
import { Link } from "react-router-dom";

const InitialComponent = () => (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/frontend/InitialComponent.jsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Link className="App-link" to="/other-component">Other Component</Link>
      </header>
    </div>
);

export default InitialComponent;
