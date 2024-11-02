import React, { useState } from 'react';
import Toolbar from './Toolbar';
import ApiKeyComponent from './ApiKeyComponent';
import WalletComponent from './WalletComponent';

interface Component {
  id: string;
  type: 'api-key' | 'wallet';
  position: { x: number; y: number };
}

const Canvas: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('component');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setComponents([...components, {
      id: `${componentType}-${Date.now()}`,
      type: componentType as 'api-key' | 'wallet',
      position: { x, y }
    }]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="canvas">
      <Toolbar />
      <div 
        className="canvas-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {components.map((component) => (
          <div key={component.id}>
            {component.type === 'api-key' && (
              <ApiKeyComponent position={component.position} />
            )}
            {component.type === 'wallet' && (
              <WalletComponent position={component.position} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Canvas;