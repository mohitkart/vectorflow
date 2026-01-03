// outputNode.js

import { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { selector, useStore } from '../../utills/store';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data.outputType || 'Text');
   const {
          onNodeDataUpdate,
          removeNode,
        } = useStore(selector, shallow);

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setOutputType(e.target.value);
  };

   useEffect(()=>{
      onNodeDataUpdate({id:data.id,name:currName})
    },[currName])
  

  return (
    <div className="w-[200px] border border-blue-500 rounded text-[12px]">
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-value`}
      />
      <div className='px-3 py-2 font-bold border-b border-blue-500 bg-blue-50 flex gap-1 items-center'>
        <span className="material-symbols-outlined text-[20px]">output</span>
        <span>Output</span>
        <span className="material-symbols-outlined !text-[18px] text-red-500 ml-auto cursor-pointer" onClick={()=>removeNode(id)}>close</span>
      </div>
      <div className='p-2 bg-white'>
        <label
        className='mb-1 block'
        >
          <input 
            type="text" 
            value={currName} 
            className='border rounded px-2 py-1 w-full bg-gray-50'
            onChange={handleNameChange} 
          />
        </label>
        <label>
          Type:
          <select value={outputType} onChange={handleTypeChange}
          className='border rounded px-2 py-1 w-full bg-white'
          >
            <option value="Text">Text</option>
            <option value="File">Image</option>
          </select>
        </label>
      </div>
    </div>
  );
}
