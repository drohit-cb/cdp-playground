'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const DraggableItem = () => {
  const {attributes, listeners, setNodeRef, isDragging} = useDraggable({
    id: 'draggable-wallet',
    data: {
      type: 'new-wallet'
    }
  });

  return (
    <div 
      ref={setNodeRef}
      className="toolbar-item"
      style={{
        opacity: isDragging ? 0.5 : 1, // Changed undefined to 1
        cursor: 'grab',
        touchAction: 'none', // Add this
        padding: '10px',    // Add some padding
        border: '1px solid #ddd', // Make it visible
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'white'
      }}
      {...listeners}
      {...attributes}
    >
      <span>👛</span>
      <span>Wallet</span>
    </div>
  );
};

const Toolbar: React.FC = () => {
  return (
    <div className="toolbar" style={{ padding: '16px', borderRight: '1px solid #ddd' }}>
      <div className="toolbar-header" style={{ marginBottom: '16px', fontWeight: 'bold' }}>
        Components
      </div>
      <div className="toolbar-items">
        <DraggableItem />
      </div>
    </div>
  );
};

export default Toolbar;