/* import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
} */

import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import "./App.css";
import MainPage from './component/MainPage';
import ErrorPage from './component/ErrorPage';
import Nav from './component/Nav';
import RecylePage from './component/RecyclePage';
import RecylePage1 from './component/RecyclePage1';

function App() {
  return (
    <BrowserRouter>
      <Nav />
        <Routes>
          <Route path="/RecyclerPro" element={<Navigate to="/home" />} />
          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} /> */}
          {/* <Route path="/news" element={<News />} /> */}
          <Route path="/home" element={<MainPage />} />
          <Route path="/detect" element={<RecylePage/>}/>
          <Route path="/detect1" element={<RecylePage1/>}/>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;