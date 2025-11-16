// src/submit.js
import React from "react";
import { useStore } from "./store";

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8000/pipelines/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges }),
      });

      const data = await response.json();

      alert(
        `Pipeline Analysis:\n\n` +
        `Nodes: ${data.num_nodes}\n` +
        `Edges: ${data.num_edges}\n` +
        `Is DAG: ${data.is_dag ? "Yes ✔" : "No ✘"}`
      );
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Failed to submit pipeline to backend.");
    }
  };

  return (
    <button className="submit-button" onClick={handleSubmit}>
      Submit Pipeline
    </button>
  );
};
