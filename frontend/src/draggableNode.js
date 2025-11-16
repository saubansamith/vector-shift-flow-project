// src/draggableNode.jsx
import React from 'react';

export const DraggableNode = ({ type, label }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="draggable-node"
      onDragStart={(e) => onDragStart(e, type)}
      draggable
      title={`Drag to canvas: ${label}`}
    >
      <div style={{ fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{type}</div>
    </div>
  );
};
