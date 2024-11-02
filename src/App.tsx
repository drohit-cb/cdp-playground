import React from 'react';
import { CdpProvider } from './contexts/CdpContext';
import Canvas from './components/Canvas';
import './App.css';

function App() {
  return (
    <CdpProvider>
      <Canvas />
    </CdpProvider>
  );
}

export default App;