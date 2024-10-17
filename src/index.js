import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ContractDashboard from './components/ContractDashboard';
import ErrorBoundary from './ErrorBoundary';

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ContractDashboard />
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);