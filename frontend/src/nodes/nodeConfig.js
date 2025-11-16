// nodeConfigs.js
import React, { useState, useEffect, useRef } from 'react';

function TextNodeEditor({ id, data, updateData, extractVariables }) {
  const initial = data?.text ?? '';
  const [local, setLocal] = useState(initial);
  const ref = useRef(null);
  const debounceRef = useRef(null);

  // sync if external data changes (e.g., programmatic updates)
  useEffect(() => {
    if ((data?.text ?? '') !== local) {
      setLocal(data?.text ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.text]);

  // auto-resize
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [local]);

  const commit = (nextText) => {
    const vars = extractVariables(nextText);
    // only send minimal patch (do NOT spread entire data)
    updateData({
      text: nextText,
      variables: vars
    });
  };

  const onChange = (e) => {
    const next = e.target.value;
    setLocal(next);

    // debounce commits to the node to avoid heavy re-renders
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => commit(next), 250);
  };

  // stop propagation for many events so ReactFlow doesn't steal keys/clicks
  const stopAll = (e) => {
    e.stopPropagation();
  };

  return (
    <textarea
      id={`text-input-${id}`}
      ref={ref}
      defaultValue={local}
      onChange={onChange}
      onBlur={() => commit(local)}    /* commit on blur as well */
      // onKeyDown={stopAll}
      // onKeyUp={stopAll}
      // onKeyPress={stopAll
      className="nodrag"
      style={{
        width: "100%",
        minHeight: "60px",
        resize: "none",
        overflow: "hidden",
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: "8px",
        color: "white",
        padding: "8px",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box",
        pointerEvents: "auto",
        zIndex: 5,
      }}
    />
  );
}


export const nodeConfig = {
  inputNode: {
    title: "Input Node",
    inputs: [],
    outputs: [{ id: "out", label: "Output" }],
    style: { background: "#E3F2FD" },
    onEdit: (id, data) => alert("Editing node " + id),
    onView: (id, data) => alert("Viewing node " + id)
  },

  outputNode: {
    title: "Output Node",
    inputs: [{ id: "in", label: "Input" }],
    outputs: [],
    style: { background: "#FFEBEE" }
  },

  llmNode: {
    title: "LLM Node",
    inputs: [{ id: "prompt", label: "Prompt" }],
    outputs: [{ id: "response", label: "Response" }],
    style: { background: "#E8F5E9" }
  },

  text: {
    title: "Text",
    description: "Dynamic text with variables",
    inputs: [],
    outputs: [{ id: "out", label: "Output" }],
    style: {},

    // Extract variables like {{ var }}
    extractVariables: (text) => {
      const regex = /\{\{\s*([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\}\}/g;
      const found = new Set();
      let m;
      while ((m = regex.exec(text)) !== null) found.add(m[1]);
      return [...found];
    },

    // Custom rendering for the node body
    render: ({ id, data, updateData }) => {
  return (
    <TextNodeEditor
      id={id}
      data={data}
      updateData={updateData}
      extractVariables={nodeConfig.text.extractVariables}
    />
  );
},
    // Dynamic handles based on variables
    dynamicHandles: (data) => {
  return (data.variables || []).map(v => ({
    id: v,
    label: v,
    type: "target"
  }));
}
,
  },

  // ---------------------------------------
// NEW LLM NODES
// ---------------------------------------

  promptTemplateNode: {
    title: "Prompt Template",
    inputs: [
      { id: "text", label: "Text" },
      { id: "vars", label: "Variables" }
    ],
    outputs: [
      { id: "prompt", label: "Final Prompt" }
    ],
    style: { background: "#E1F5FE" }
  },

  summarizerNode: {
    title: "Summarizer",
    inputs: [
      { id: "text", label: "Text" }
    ],
    outputs: [
      { id: "summary", label: "Summary" }
    ],
    style: { background: "#FFECB3" }
  },

  classifierNode: {
    title: "Classifier",
    inputs: [
      { id: "text", label: "Text" }
    ],
    outputs: [
      { id: "label", label: "Label" }
    ],
    style: { background: "#F8BBD0" }
  },

  embeddingNode: {
    title: "Embedding Generator",
    inputs: [
      { id: "text", label: "Text" }
    ],
    outputs: [
      { id: "embedding", label: "Vector" }
    ],
    style: { background: "#DCEDC8" }
  },

  routerNode: {
    title: "Router",
    inputs: [
      { id: "text", label: "Text" }
    ],
    outputs: [
      { id: "positive", label: "Positive" },
      { id: "negative", label: "Negative" },
      { id: "neutral", label: "Neutral" }
    ],
    style: { background: "#D7CCC8" }
  }
};