// inputNode.js

import { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { selector, useStore } from '../../utills/store';
import { shallow } from 'zustand/shallow';

export const InputNode = ({ id, data }) => {
   const {
        onNodeDataUpdate,
        removeNode,
      } = useStore(selector, shallow);

  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data.inputType || 'Text');

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  useEffect(()=>{
    onNodeDataUpdate({id:data.id,name:currName})
  },[currName])

  const handleTypeChange = (e) => {
    setInputType(e.target.value);
  };
  return (
    <div className="w-[200px] border border-blue-500 rounded text-[12px]">
      <div className='px-3 py-2 font-bold border-b border-blue-500 bg-blue-50 flex gap-1 items-center'>
        <span className="material-symbols-outlined !text-[20px]">input</span>
        <span>Input</span>
        <span className="material-symbols-outlined !text-[18px] text-red-500 ml-auto cursor-pointer" onClick={()=>removeNode(id)}>close</span>
      </div>
      <div className='p-2 bg-white'>
        <label className='mb-1 block'>
          <input 
            type="text" 
            value={currName?.trim()} 
            className='border rounded px-2 py-1 w-full bg-gray-50'
            onChange={handleNameChange} 
          />
        </label>
        <label>
          Type:
          <select
          value={inputType} 
          onChange={handleTypeChange}
           className='border rounded px-2 py-1 w-full bg-white'
          >
            <option value="Text">Text</option>
            <option value="File">File</option>
          </select>
        </label>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-value`}
      />
    </div>
  );
}
