// llmNode.js

import { Handle, Position } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { selector, useStore } from '../../utills/store';

export const LLMNode = ({ id, data }) => {
 const {
        onNodeDataUpdate,
        removeNode,
      } = useStore(selector, shallow);

  return (
    <div className="w-[200px] border border-blue-500 rounded text-[12px]">
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-system`}
        style={{top: `${100/3}%`}}
      />
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-prompt`}
        style={{top: `${200/3}%`}}
      />
      <div className='px-3 py-2 font-bold border-b border-blue-500 bg-blue-50 flex gap-1 items-center'>
        <span className="material-symbols-outlined text-[20px]">chat</span>
        <span>LLM</span>
        <span className="material-symbols-outlined !text-[18px] text-red-500 ml-auto cursor-pointer" onClick={()=>removeNode(id)}>close</span>
      </div>
      <div className='p-2 bg-white'>
        <span>This is a LLM.</span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-response`}
      />
    </div>
  );
}
