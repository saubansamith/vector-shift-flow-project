// src/nodes/BaseNode.jsx
import React, { useEffect } from "react";
import { Handle, Position, useUpdateNodeInternals} from 'reactflow';
import { nodeConfig } from "./nodeConfig";
import '../index.css'; // optional: you can keep styles in index.css; import if you used a separate CSS file

const Icon = ({ type }) => {
  // small inline SVG icon per type (keeps bundle light)
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.2" opacity="0.9" />
      <circle cx="8.5" cy="11.5" r="1.6" fill="currentColor" />
      <path d="M12.5 8h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
};

const variablesOrInputsPadding = (data) => {
  const vars = data?.variables || [];
  const staticInputs = nodeConfig[data.nodeType]?.inputs?.length || 0;

  if (vars.length > 0 || staticInputs > 0) return "22px"; // space for handles
  return "0px";
};


const hexToRgba = (hex, alpha) => {
  const c = hex.replace("#", "");
  const bigint = parseInt(c, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};



export default function BaseNode({ id, data }) {
  const config = nodeConfig[data.nodeType] || {};
  const updateNodeInternals = useUpdateNodeInternals();
  // data expected shape: { title, inputs[], outputs[], style, description, ... }
  const title = data?.title || data?.label || 'Node';
  const inputs = data?.inputs || [];
  const outputs = data?.outputs || [];
  const description = data?.description || data?.nodeType || '';
  const style = data?.style || {};

  useEffect(() => {
  const el = document.getElementById(`text-input-${id}`);
  if (el) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  // ⭐ CRITICAL: tell ReactFlow to recalc handles
  updateNodeInternals(id);

}, [data.text, data.variables]);



    const onEdit = () => {
    console.log("Clicked Edit");
    if (data?.onEdit) data.onEdit({
      id,
      ...data
    });
};


  const onView = () => {
    if (data?.onView) {
      data.onView(id, data);
    } else {
      console.log("View clicked for node:", id, data);
    }
  };

  console.log("Dynamic handles:", config.dynamicHandles?.(data));

  return (
    <div className="base-node" style={{...data.style,
    background: data.style?.background
      ? `linear-gradient(
          180deg,
          ${hexToRgba(data.style.background, 0.18)},
          ${hexToRgba(data.style.background, 0.08)}
        )`
      : undefined}}>
      <div className="node-header">
        <div className="node-icon" style={{ color: 'var(--accent)' }}>
          <Icon />
        </div>

        <div style={{ flex: 1 }}>
          <div className="node-title">{title}</div>
          <div className="node-sub">{description}</div>
        </div>

        <div style={{ marginLeft: 8 }}>
          {/* small accent bar */}
          <div style={{
            width: 6,
            height: 34,
            borderRadius: 6,
            background: 'linear-gradient(180deg, rgba(0,229,255,0.9), rgba(0,229,255,0.4))'
          }} />
        </div>
      </div>

      <div className="node-body">
        {/* Informational / placeholder content */}
        {data?.fields ? (
          <div>{/* render form fields if present later */}</div>
        ) : (
          <div className="node-desc">{description}</div>
        )}


        <div 
          style={{
            marginTop: "8px",
            position: "relative",
            zIndex: 20,
            pointerEvents: "auto",
          }}
        >
          {config.render && config.render({
            id,
            data,
            updateData: (patch) => data?.onChange && data.onChange(id, patch),
          })}
        </div>
      </div>

      <div className="node-footer">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div className="node-action" onClick={onEdit}>Edit</div>
            {/* <div className="node-action" onClick={onView}>View</div> */}
        </div>
      </div>
      

{config.dynamicHandles &&
  config.dynamicHandles(data).map((h, i) => (
    <React.Fragment key={`var-${i}`}>
      
      <Handle
        type="target"
        id={h.id}
        position={Position.Left}
        isConnectable={true}
        style={{
          position: "absolute",
          left: -6,
          top: 54 + i * 28,
          borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, rgba(0,229,255,0.18), rgba(0,229,255,0.06))",
          border: "2px solid rgba(0,229,255,0.75)",
          boxShadow: "0 0 14px var(--accent)",
          width: 7,
          height: 7,
          pointerEvents: "auto",   // critical
          zIndex: 9999             // critical
        }}
      />

      <div
        style={{
          position: "absolute",
          left: -40,
          top: 48 + i * 28 - 6,
          pointerEvents: "none",
          zIndex: 9999
        }}
        className="handle-label"
      >
        {h.id}
      </div>
    </React.Fragment>
  ))
}




      {/* STATIC INPUT HANDLES          */}
      {/* ----------------------------- */}
      {inputs.map((h, i) => {
        const top = 54 + i * 28;

        return (
          <React.Fragment key={`in-${i}`}>
            <Handle
              type="target"
              id={h.id || `in-${i}`}
              position={Position.Left}
              isConnectable={true}
              style={{
                position: "absolute",
                left: -6,
                top,
                background: "transparent",
                border: "2px solid rgba(0,229,255,0.75)",
                boxShadow: "0 0 14px var(--accent)",
              }}
            />

            <div
              className="handle-label"
              style={{
                position: "absolute",
                left: -66,
                top: top - 13,
              }}
            >
              {h.label}
            </div>
          </React.Fragment>
        );
      })}


      {outputs.map((h, i) => (
        <div key={`out-${i}`} style={{ position: 'absolute', right: -6, top: 54 + i * 28 }}>
          <Handle
            type="source"
            position={Position.Right}
            id={h.id || `out-${i}`}
            isConnectable={true}
            className="custom-handle source-handle"
            style={{ background: 'transparent', border: "2px solid rgba(0,229,255,0.75)"}}
          />
          <div className="handle-label" style={{ position: 'absolute', right: -60, top: -6 }}>{h.label}</div>
        </div>
      ))}
    </div>
  );
}
