'use client';

import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  DragEndEvent,
  useDraggable,
  useDroppable,
  DragOverlay,
  DragStartEvent,
  pointerWithin    // Add this
} from '@dnd-kit/core';
import Toolbar from './Toolbar';
import WalletComponent from './WalletComponent';
import './Canvas.css';
import { createPortal } from 'react-dom';

interface Component {
  id: string;
  type: 'wallet';
  position: { x: number; y: number };
}

function DraggableWallet({ id, position, onWalletCreated }: { id: string; position: { x: number; y: number }; onWalletCreated: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    data: {
      type: 'existing-wallet',
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x + position.x}px, ${transform.y + position.y}px, 0)`,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: isDragging ? 1000 : 1,
    opacity: isDragging ? 0.8 : 1,
    touchAction: 'none',
  } : {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    touchAction: 'none',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <WalletComponent 
        position={position} 
        onWalletCreated={onWalletCreated}
      />
    </div>
  );
}

const Canvas: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  
  const { setNodeRef } = useDroppable({
    id: 'canvas-droppable',
  });

  const handleDragStart = (event: DragStartEvent) => {
    console.log('Drag Start:', event.active.data.current?.type);
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    console.log('Drag End:', event.active.data.current?.type);

    const canvasRect = document.querySelector('.canvas-area')?.getBoundingClientRect();
    if (!canvasRect) return;

    if (event.active.data.current?.type === 'new-wallet') {
      const x = event.delta.x + (window.scrollX - canvasRect.left);
      const y = event.delta.y + (window.scrollY - canvasRect.top);
      
      setComponents([...components, {
        id: `wallet-${Date.now()}`,
        type: 'wallet',
        position: { x, y }
      }]);
    } else if (event.active.data.current?.type === 'existing-wallet') {
      setComponents(components.map(comp => {
        if (comp.id === event.active.id) {
          return {
            ...comp,
            position: {
              x: comp.position.x + event.delta.x,
              y: comp.position.y + event.delta.y
            }
          };
        }
        return comp;
      }));
    }
  };

  const handleWalletCreated = () => {
    setShowToast(true);
    // Auto-hide after 2 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  // Add this to check if the toast is being unmounted
  useEffect(() => {
    if (showToast) {
      console.log('Toast mounted');
      return () => {
        console.log('Toast unmounted');
      };
    }
  }, [showToast]);

  // Add debug logging
  useEffect(() => {
    console.log('Toast state changed:', showToast);
  }, [showToast]);

  return (
    <>
      <div className="canvas">
        <DndContext 
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Toolbar />
          <div className="canvas-wrapper">
            <div ref={setNodeRef} className="canvas-area">
              {components.map((component) => (
                <DraggableWallet 
                  key={component.id}
                  id={component.id}
                  position={component.position}
                  onWalletCreated={handleWalletCreated}
                />
              ))}
            </div>
          </div>
          <DragOverlay>
            {activeId === 'new-wallet' && (
              <div className="dragging-overlay">
                <div className="component-header">
                  <span>👛</span>
                  <span>Wallet</span>
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {showToast && createPortal(
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#4caf50',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 9999,
          transition: 'opacity 0.3s ease-in-out',
        }}>
          Wallet created successfully!
        </div>,
        document.body
      )}
    </>
  );
};

export default Canvas;