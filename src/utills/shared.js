export function extractVariables(text) {
  const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$-]*)\s*\}\}/g;
  const variables = [...text.matchAll(regex)].map(match => match[1]);
  return  [...new Set(variables)];
}

export function replaceVariables(text, data) {
  const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$-]*)\s*\}\}/g;
  return text.replace(regex, (_, key) => {
    return key in data ? (data[key]||key||'__') : `{{${key}}}`;
  });
}

export const DEFAULT_VARIABLES = [
  "userName",
  "email",
  "orderId",
  "company",
  "createdAt"
];

export function getCurrentVariable(text, cursorPosition) {
  const textUntilCursor = text.slice(0, cursorPosition);
  const match = textUntilCursor.match(/{{\s*([a-zA-Z_$]*)$/);
  if (!match) return null;
  return match[1]; // partial variable
}

export function getRandomCode(length = 5) {
  const letters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  // const letters = '0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += letters[Math.floor(Math.random() * letters.length)];
  }
  return code;
}

export const isDAG = (nodes, edges) => {
  const graph = {};
  nodes.forEach((n) => (graph[n.id] = []));

  edges.forEach((e) => {
    graph[e.source].push(e.target);
  });

  const visited = new Set();
  const stack = new Set();

  const dfs = (node) => {
    if (stack.has(node)) return false;
    if (visited.has(node)) return true;

    visited.add(node);
    stack.add(node);

    for (const nei of graph[node]) {
      if (!dfs(nei)) return false;
    }

    stack.delete(node);
    return true;
  };

  return Object.keys(graph).every(dfs);
};


export function isHandleConnected(edges, nodeId, handleId, type) {
  return edges.some(edge =>
    type === 'source'
      ? edge.source === nodeId && edge.sourceHandle === handleId
      : edge.target === nodeId && edge.targetHandle === handleId
  );
}
