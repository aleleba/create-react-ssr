import React from 'react';
import logo from '../logo.svg';
import './InitialComponent.scss';
import { Link } from "react-router-dom";

const OtherComponent = () => (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
            Edit src/frontend/OtherComponent.jsx and save to reload.
        </p>
        <Link className="App-link" to="/">Initial Component</Link>
      </header>
    </div>
);

export default OtherComponent;
