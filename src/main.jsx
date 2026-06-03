import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/index.css';
import App from './App';
import ChatBot from "./shared/components/ChatBot";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <ChatBot/> 
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
