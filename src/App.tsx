// src/App.tsx
import React from 'react';
import './App.css';
import DataFetcher from './DataFetcher';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Cosumindo github</h1>
        <DataFetcher />
      </header>
    </div>
  );
};

export default App;
