// PreviewNode.js

import { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { selector, useStore } from '../../utills/store';

export const PreviewNode = ({ id, data }) => {
  const {
    nodes,
    edges,
    removeNode,
  } = useStore(selector, shallow);

  return (
    <div className="w-[200px] border border-blue-500 rounded text-[12px]">
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-value`}
      />
      <div className='px-3 py-2 font-bold border-b border-blue-500 bg-blue-50 flex gap-1 items-center'>
        <span className="material-symbols-outlined text-[20px]">preview</span>
        <span>Preview</span>
        <span className="material-symbols-outlined !text-[18px] text-red-500 ml-auto cursor-pointer" onClick={() => removeNode(id)}>close</span>
      </div>
      <div className='p-2 bg-white'>
        <div>Nodes : {nodes?.length}</div>
        <div>Edges : {edges?.length}</div>
      </div>
    </div>
  );
}
