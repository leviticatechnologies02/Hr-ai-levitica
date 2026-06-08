import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/index.css';
import App from './App';
import ChatBot from "./shared/components/ChatBot";
import ScrollToTop from './shared/components/ScrollToTop';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <ChatBot/> 
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
