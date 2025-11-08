import React from 'react';
import ReactDOM from 'react-dom/client';
// Fix: Add .tsx extension to App import to resolve module error.
import App from './App.tsx';

// Fix: Inject custom CSS that was incorrectly placed in types.ts
const customCss = `
/* Custom class for form inputs in the admin panel */
.form-input {
    width: 100%;
    background-color: #121212; /* brand-dark */
    border: 1px solid #2E2E2E; /* brand-gray */
    border-radius: 0.5rem; /* rounded-lg */
    padding: 0.75rem 1rem; /* py-3 px-4 */
    color: #F5F5F5; /* brand-text */
    font-family: 'Menlo', 'Monaco', 'Courier New', monospace; /* The requested font change for a "technical" feel */
    transition: all 0.2s ease-in-out;
}

.form-input:focus {
    outline: none;
    border-color: #E0FF00; /* brand-primary */
    box-shadow: 0 0 0 2px #E0FF00; /* Equivalent to ring-2 ring-brand-primary */
}


/* Animation for fade-in effect */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}
`;

const styleElement = document.createElement('style');
styleElement.innerHTML = customCss;
document.head.appendChild(styleElement);


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);