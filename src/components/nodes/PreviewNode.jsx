// PreviewNode.js

import { useMemo } from 'react';
import { Handle, Position } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { selector, useStore } from '../../utills/store';
import { isHandleConnected, replaceVariables } from '../../utills/shared';

export const PreviewNode = ({ id, data }) => {
  const {
    nodes,
    edges,
    removeNode,
  } = useStore(selector, shallow);
  const textId = useMemo(() => {
    return edges.find(itm => itm.target == id)?.source
  }, [edges.map(itm=>itm.id).toString()])

  const textInputIds = useMemo(() => {
    return edges.filter(itm => itm.target == textId).map(itm => itm.source)
  }, [edges.map(itm=>itm.id).toString(), textId])

  const textInputs = useMemo(() => {
    const arr = nodes.filter(itm => textInputIds.includes(itm.id)).map(itm => itm.data)
    const obj = arr.reduce((acc, { name, value }) => {
      acc[name] = value;
      return acc;
    }, {});
    return obj
  }, [nodes,textInputIds])

  const textData = useMemo(() => {
    return nodes.find(itm => itm.id == textId)?.data || null
  }, [nodes, textId])

  const handleId = `${id}-value`;
  const isConnected = isHandleConnected(edges, id, handleId, 'target');

  console.log("nodes",nodes)
  console.log("edges",edges)

  return (
    <div className="w-[350px] border border-blue-500 rounded text-[12px]">
      <Handle
        type="target"
        isConnectable={!isConnected}
        position={Position.Left}
        id={handleId}
        className={`${isConnected ? 'isConnected' : ''}`}
      />
      <div className='px-3 py-2 font-bold border-b border-blue-500 bg-blue-50 flex gap-1 items-center'>
        <span className="material-symbols-outlined text-[20px]">preview</span>
        <span>Preview: <span className='text-blue-500'>{id}</span></span>
        <span className="material-symbols-outlined !text-[18px] text-red-500 ml-auto cursor-pointer" onClick={() => removeNode(id)}>close</span>
      </div>
      <div className='p-2 bg-white'>
        {textData ? <>
          <pre className='break-all whitespace-pre-wrap'>
            {replaceVariables(textData.text,textInputs)}
          </pre>
        </> : <>
          <div>Nodes : {nodes?.length}</div>
          <div>Edges : {edges?.length}</div>
        </>}

      </div>
    </div>
  );
}
