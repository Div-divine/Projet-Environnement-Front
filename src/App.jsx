import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
import './App.css';
import router from './routes/Router';
import { cspPolicy } from './csp-policy/cspPolicy';

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <meta httpEquiv="Content-Security-Policy" content={cspPolicy()} />
      </Helmet>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}

export default App;
