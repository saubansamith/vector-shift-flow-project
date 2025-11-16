// src/ui.js
import React, { useState, useRef, useCallback, useMemo } from "react";
import ReactFlow, { Controls, Background, MiniMap } from "reactflow";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";
import { baseNode } from "./nodes";
import { nodeConfig } from "./nodes/nodeConfig";
import "reactflow/dist/style.css";

const gridSize = 20;
const proOptions = { hideAttribution: true };

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = ({ onEditNode }) => {
  // --------------------------------------------------------------
  // 1️⃣ STANDARD HOOKS (these MUST come before anything else)
  // --------------------------------------------------------------
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  // --------------------------------------------------------------
  // 2️⃣ FIX: Memoized nodeTypes — must be INSIDE component
  // --------------------------------------------------------------
  const nodeTypes = useMemo(() => {
    return Object.fromEntries(
      Object.keys(nodeConfig).map((key) => [key, baseNode])
    );
  }, []);

  // --------------------------------------------------------------
  // 3️⃣ Node initializer (your version, unchanged)
  // --------------------------------------------------------------
  const getInitNodeData = (nodeID, type) => {
    const cfg = nodeConfig[type] || {};

  return {
    id: nodeID,
    nodeType: type,

    // keep only the *data fields*, NOT functions
    title: cfg.title,
    description: cfg.description,
    inputs: cfg.inputs ? [...cfg.inputs] : [],
    outputs: cfg.outputs ? [...cfg.outputs] : [],
    style: cfg.style ? { ...cfg.style } : {},

    text: "",
    variables: [],

    // IMPORTANT: inputs must include dynamic variables, not only static config inputs
    inputs: cfg.inputs ? [...cfg.inputs] : [],


    // preserve function references
    fullConfig: cfg,

    onEdit: onEditNode,

    onChange: (id, patch) => {
      useStore.getState().updateNodeData(id, patch);
    },
  };
};

  // -------------------------------------------------------------
  // 4️⃣ onDrop handler
  // --------------------------------------------------------------
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const raw = event.dataTransfer.getData("application/reactflow");
      if (!raw) return;

      const { nodeType: type } = JSON.parse(raw);
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const nodeID = getNodeID(type);

      addNode({
        id: nodeID,
        type,
        position,
        data: getInitNodeData(nodeID, type),
      });
    },
    [reactFlowInstance, addNode, getNodeID]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // --------------------------------------------------------------
  // 5️⃣ RETURN (JSX)
  // --------------------------------------------------------------
  return (
    <div ref={reactFlowWrapper} className="reactflow-wrapper">
      <div className="canvas-panel">
        <ReactFlow
          nodes={nodes.map(n => ({
    ...n,
    key: n.data.variables
      ? `${n.id}-${n.data.variables.join("_")}`
      : n.id,
  }))}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          snapGrid={[gridSize, gridSize]}
          connectionLineType="smoothstep"
          fitView
          proOptions={proOptions}
          style={{ width: "100%", height: "100%" }}
        >
          <Background color="#222" gap={gridSize} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
};
