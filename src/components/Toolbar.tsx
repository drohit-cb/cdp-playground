import React from 'react';

const Toolbar: React.FC = () => {
  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    e.dataTransfer.setData('component', componentType);
  };

  return (
    <div className="toolbar">
      <div className="toolbar-header">
        Components
      </div>
      <div className="toolbar-items">
        <div 
          className="toolbar-item" 
          draggable 
          onDragStart={(e) => handleDragStart(e, 'api-key')}
        >
          <span>🔑</span>
          API Key
        </div>
        <div 
          className="toolbar-item" 
          draggable 
          onDragStart={(e) => handleDragStart(e, 'wallet')}
        >
          <span>👛</span>
          Wallet
        </div>
      </div>
    </div>
  );
};

export default Toolbar;