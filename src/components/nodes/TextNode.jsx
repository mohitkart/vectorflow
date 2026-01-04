// textNode.js

import { useEffect, useMemo, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { extractVariables, getCurrentVariable, isHandleConnected } from '../../utills/shared';
import { shallow } from 'zustand/shallow';
import { selector, useStore } from "../../utills/store"

export const TextNode = ({ id, data }) => {
  const {
    nodes,
    edges,
    removeNode,
    onNodeDataUpdate,
    addNewEdge,
    removeEdge
  } = useStore(selector, shallow);

  const customInputs = nodes.filter(itm => itm.type == "customInput")
  const DEFAULT_VARIABLES = customInputs.map(itm => itm.data.name || itm.id)

  const textareaRef = useRef(null);
  const [text, setText] = useState(data?.text || ``);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPos, setCursorPos] = useState(0);
  const [variables, setVariables] = useState([]);

  useEffect(() => {
    const vars = extractVariables(text);
    setVariables(vars);
    onNodeDataUpdate({id:data.id,text:text})
  }, [text]);

  useEffect(() => {
    removeEdge(id, 'target')
    variables.map(variable => {
      const varId = customInputs.find(itm => itm.data.name == variable)?.id
      const newEdge = {
        source: varId,
        sourceHandle: `${varId}-value`,
        target: id,
        targetHandle: `${id}-${varId}-output`,
      }
      if (varId) {
        setTimeout(() => {
          addNewEdge(newEdge)
        }, 100)
      }
    })
  }, [variables.toString()])

  const handleChange = (e) => {
    const value = e.target.value;
    const cursor = e.target.selectionStart;
    const el = textareaRef.current;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";

    setText(value);
    setCursorPos(cursor);

    const current = getCurrentVariable(value, cursor);
    if (current !== null) {
      const filtered = DEFAULT_VARIABLES.filter(v =>
        v.toLowerCase().startsWith(current.toLowerCase())
      );

      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };


  const insertVariable = (variable) => {
    const before = text.slice(0, cursorPos).replace(/{{\s*[a-zA-Z_$]*$/, "");
    const after = text.slice(cursorPos);
    const updatedText = `${before}{{${variable}}}${after}`;
    setText(updatedText);
    setShowSuggestions(false);
    requestAnimationFrame(() => {
      textareaRef.current.focus();
    });
  };

  const LeftHandles = useMemo(() => {
    {
     return <>
     {variables.map((variable, index) => {
        const varId = customInputs.find(itm => itm.data.name == variable)?.id || variable
        const handleId = `${id}-${varId}-output`;
        const isConnected = isHandleConnected(edges, id, handleId, 'target');
        return (
          <Handle
            key={index}
            type="target"
            position={Position.Left}
            id={handleId}
            title={handleId}
            isConnectable={!isConnected}
            className={`${isConnected ? 'isConnected' : ''}`}
            style={{ top: 40 + index * 20 }}
          />
        )
      })}
     </>
    }
  }, [variables.toString(),edges.map(itm=>itm.id).toString(),customInputs.map(itm=>itm.data.name).toString()])


  const handleId = `${id}-value`;
  const isConnected = isHandleConnected(edges, id, handleId, 'source');
  return (
    <div className="w-[350px] border border-blue-500 rounded text-[12px]">
      {/* Dynamic Handles */}
      {LeftHandles}

      <div className='px-3 py-2 font-bold border-b border-blue-500 bg-blue-50 flex gap-1 items-center'>
        <span className="material-symbols-outlined !text-[20px]">text_ad</span>
        <span>Text : <span className='text-blue-500'>{id}</span></span>
        <span className="material-symbols-outlined !text-[18px] text-red-500 ml-auto cursor-pointer" onClick={() => removeNode(id)}>close</span>
      </div>
      <div className='p-2 bg-white'>
        <label>
          Text:
          <textarea
            type="text"
            row={1}
            className='border rounded px-2 py-1 w-full resize-none overflow-hidden'
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onClick={(e) => setCursorPos(e.target.selectionStart)}
            onKeyUp={(e) => setCursorPos(e.target.selectionStart)}
          />
        </label>
        {showSuggestions && (
          <ul className="absolute z-10 bg-white border rounded shadow w-48">
            {suggestions.map((item) => (
              <li
                key={item}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => insertVariable(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id={handleId}
        isConnectable={!isConnected}
        className={`${isConnected ? 'isConnected' : ''}`}
      />


    </div>
  );
}
