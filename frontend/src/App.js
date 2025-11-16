import React, { useState } from "react";
import { PipelineToolbar } from "./toolbar";
import { PipelineUI } from "./ui";
import { SubmitButton } from "./submit";
import Modal from "./component/Modal";
import "./index.css";
import { useStore } from "./store";

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalNode, setModalNode] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const updateNode = useStore((state) => state.updateNode);



  const openEditModal = (node) => {
    console.log("Open modal for node:", node);
    setSelectedNodeId(node.id);
    setModalNode(node);
    setModalOpen(true);
  };



  return (
    <div className="app-shell">
      <PipelineToolbar />

      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <PipelineUI onEditNode={openEditModal} />

        <div style={{ padding: 12 }}>
          <SubmitButton />
        </div>
      </div>

      {/* GLOBAL MODAL */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
  <h2 style={{ marginTop: 0, marginBottom: 10 }}>{modalNode?.title || "Edit Node"}</h2>

  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

    {/* Title field */}
    <div>
      <label style={{ fontSize: 12, opacity: 0.8 }}>Title</label>
      <input
        id="edit-title"
        type="text"
        defaultValue={modalNode?.title}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(255,255,255,0.08)",
          color: "white",
          marginTop: 4
        }}
      />
    </div>

    {/* Description field */}
    <div>
      <label style={{ fontSize: 12, opacity: 0.8 }}>Description</label>
      <textarea
        id="edit-desc"
        defaultValue={modalNode?.description}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(255,255,255,0.08)",
          color: "white",
          marginTop: 4,
          height: 70
        }}
      />
    </div>

    {/* Background field */}
    <div>
      <label style={{ fontSize: 12, opacity: 0.8 }}>Background Color</label>
      <input
        id="edit-bg"
        type="color"
        defaultValue={modalNode?.style?.background || "#0B0E12"}
        style={{
          width: "100%",
          padding: "6px",
          borderRadius: 8,
          background: "rgba(255,255,255,0.08)",
          marginTop: 4,
          border: "1px solid rgba(255,255,255,0.15)"
        }}
      />
    </div>

  </div>

  {/* Buttons */}
  <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 10 }}>
    <button
      onClick={() => setModalOpen(false)}
      style={{
        padding: "8px 12px",
        borderRadius: 8,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        color: "white"
      }}
    >
      Cancel
    </button>

<button
  onClick={() => {
    const updated = {
      id: selectedNodeId,
      title: document.getElementById("edit-title").value,
      description: document.getElementById("edit-desc").value,
      style: {
        background: document.getElementById("edit-bg").value
      }
    };

    updateNode(selectedNodeId, updated);
    setModalOpen(false);
  }}
  style={{
    padding: "8px 12px",
    borderRadius: 8,
    background: "rgba(0,229,255,0.2)",
    border: "1px solid rgba(0,229,255,0.4)",
    color: "white",
    fontWeight: 600
  }}
>
  Save
</button>

  </div>
</Modal>


    </div>
  );
}

export default App;
