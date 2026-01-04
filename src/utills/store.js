// store.js

import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';
import { getRandomCode } from "./shared";

export const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  onNodeDataUpdate: state.onNodeDataUpdate,
  removeNode: state.removeNode,
  addNewEdge: state.addNewEdge,
  removeEdge: state.removeEdge
});


export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  addNode: (node) => {
    set({
      nodes: [...get().nodes, node]
    });
  },
  addNewEdge: (...p) => {
    set({
      edges: [...get().edges, ...p.map(itm => ({
        id: `edge-${getRandomCode(8)}`,
        source: itm.source,
        sourceHandle: itm.sourceHandle,
        target: itm.target,
        targetHandle: itm.targetHandle,
        animated: true,
        type: "smoothstep",
        markerEnd: {
          height: "20px",
          type: "arrow",
          width: "20px"
        }
      }))]
    });
  },
  removeNode: (id) => {
    set({
      nodes: [...get().nodes.filter(itm => itm.id != id)],
      edges: [...get().edges.filter(itm => (itm.source != id && itm.target != id))]
    });
  },
  removeEdge: (id, key = 'id') => {
    set({
      edges: [...get().edges.filter(itm => itm[key] != id)],
    });
  },
  onNodeDataUpdate: (changes) => {
    set({
      nodes: get().nodes.map(itm => itm.id == changes.id ?
        { ...itm, data: { ...itm.data, ...changes } }
        : itm),
    });
  },
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge({ ...connection, type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' } }, get().edges),
    });
  },
  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, [fieldName]: fieldValue };
        }
        return node;
      }),
    });
  },
}));


