  import { create } from "zustand";
  import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
  } from "reactflow";

  // ⭐ Production-safe store
  export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],

    // ---------------------------
    // NODE ID GENERATOR
    // ---------------------------
    getNodeID: (type) => {
      const count =
        get().nodes.filter((n) => n.type === type).length + 1;
      return `${type}-${count}`;
    },

    // ---------------------------
    // ADD NODE
    // ---------------------------
    addNode: (node) =>
      set((state) => ({
        nodes: [...state.nodes, node],
      })),

    // ---------------------------
    // NODE CHANGES (required)
    // ---------------------------
    onNodesChange: (changes) =>
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      }),

    // ---------------------------
    // EDGE CHANGES (required)
    // ---------------------------
    onEdgesChange: (changes) =>
      set({
        edges: applyEdgeChanges(changes, get().edges),
      }),

    // ---------------------------
    // CONNECT (handles new edges)
    // ---------------------------
    onConnect: (params) =>
      set({
        edges: addEdge(
          {
            ...params,
            animated: true,
            style: { strokeWidth: 2 },
          },
          get().edges
        ),
      }),

    // ---------------------------
    // UPDATE NODE DATA (reactive)
    // ---------------------------
    updateNodeData: (id, patch) =>
  set((state) => ({
    nodes: state.nodes.map((node) => {
      if (node.id !== id) return node;

      const newData = {
        ...node.data,
        ...patch,
      };

      // ⭐ If variables changed, dynamic handles MUST be persisted into node.data
      if (patch.variables) {
        newData.variables = [...patch.variables];
      }

      return {
        ...node,
        data: newData,
      };
    }),
  })),


    // ---------------------------
    // RESET PIPELINE
    // ---------------------------
    clear: () => set({ nodes: [], edges: [] }),
  }));
