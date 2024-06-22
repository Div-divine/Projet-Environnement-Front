import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
import './App.css';
import router from './routes/Router';
import { cspPolicy } from './csp-policy/cspPolicy';
import { CsrfProvider } from './context/CsrfContext';

function App() {
  return (
    <HelmetProvider>
      <CsrfProvider>
        <Helmet>
          <meta httpEquiv="Content-Security-Policy" content={cspPolicy()} />
        </Helmet>
        <RouterProvider router={router} />
      </CsrfProvider>
    </HelmetProvider>
  );
}

export default App;
