import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../css/style.css';

const container = document.getElementById('root') || document.getElementById('app');
if (container) {
    ReactDOM.createRoot(container).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
