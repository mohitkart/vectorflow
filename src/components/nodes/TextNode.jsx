// textNode.js

import { useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { extractVariables, getCurrentVariable } from '../../utills/shared';
import { shallow } from 'zustand/shallow';
import { selector, useStore } from "../../utills/store"

export const TextNode = ({ id, data }) => {
  const {
    nodes,
    removeNode
  } = useStore(selector, shallow);

  const DEFAULT_VARIABLES = nodes.filter(itm => itm.type == "customInput").map(itm => itm.data.name || itm.id)

  const textareaRef = useRef(null);
  const [text, setText] = useState(data?.text || ``);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPos, setCursorPos] = useState(0);
  const [variables, setVariables] = useState([]);

  useEffect(() => {
    const vars = extractVariables(text);
    setVariables(vars);
  }, [text]);


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
  return (
    <div className="w-[300px] border border-blue-500 rounded text-[12px]">
      {/* Dynamic Handles */}
      {variables.map((variable, index) => (
        <Handle
          key={variable}
          type="target"
          position={Position.Left}
          title={variable}
          id={`${variable}-${index}-value`}
          style={{ top: 40 + index * 20 }}
        />
      ))}

      <div className='px-3 py-2 font-bold border-b border-blue-500 bg-blue-50 flex gap-1 items-center'>
        <span className="material-symbols-outlined !text-[20px]">text_ad</span>
        <span>Text</span>
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
        id={`${id}-output`}
      />


    </div>
  );
}
