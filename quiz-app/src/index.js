import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import BrowserRouter from 'react-router-dom/BrowserRouter';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter basename={process.env.PUBLIC_URL}> {/* url changes based on dev mode */}
        <App />
    </BrowserRouter>
);