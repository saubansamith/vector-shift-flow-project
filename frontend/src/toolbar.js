// src/toolbar.js
import React from 'react';
import { DraggableNode } from './draggableNode';
import { nodeConfig } from './nodes/nodeConfig'; // or './nodes/nodeConfig.js'

export const PipelineToolbar = () => {
  const entries = Object.entries(nodeConfig || {});

  return (
    <aside className="pipeline-toolbar">
      <h3>Nodes</h3>
      <div className="toolbar-grid">
        {entries.map(([type, cfg]) => (
          <DraggableNode key={type} type={type} label={cfg.title || type} />
        ))}
      </div>
    </aside>
  );
};
