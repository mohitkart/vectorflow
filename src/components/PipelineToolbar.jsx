// toolbar.js

import { shallow } from "zustand/shallow";
import { DraggableNode } from "./DraggableNode";
import { selector, useStore } from "../utills/store";
import { API_URL } from "../environment";
import { useState } from "react";
import Modal from "./Modal";
import { isDAG } from "../utills/shared";


export const PipelineToolbar = () => {
    const {
        nodes,
        edges,
    } = useStore(selector, shallow);

    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)

    const onSubmit = () => {
        setLoading(true)
        fetch(`${API_URL}pipelines/parse`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nodes, edges,
                // is_dag:isDAG(nodes,edges)
                is_dag:false
            })
        })
            .then(res => res.json())
            .then(data => {
                setLoading(false)
                setResult(data)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            });

    }

    return (
        <div className="p-2 flex flex-wrap gap-2 bg-blue-50 border-b border-blue-500">
            <DraggableNode type='customInput' label="Input" icon={<span className="material-symbols-outlined !text-[18px]">input</span>} />
            <DraggableNode type='llm' label='LLM' icon={<span className="material-symbols-outlined !text-[18px]">chat</span>} />
            <DraggableNode type='customOutput' label='Output' icon={<span className="material-symbols-outlined !text-[18px]">output</span>} />
            <DraggableNode type='text' label='Text' icon={<span className="material-symbols-outlined !text-[18px]">text_ad</span>} />

            <button
                onClick={onSubmit}
                disabled={loading}
                className="text-white cursor-pointer px-4 py-2 bg-blue-500 rounded text-[12px] hover:scale-105 hover:shadow-lg">{loading ? 'Loading...' : 'Submit'}</button>

                {result?<Modal
                title="Result"
                body={<>
                <div>No of Nodes : {result?.num_nodes}</div>
                <div>No of Edges : {result?.num_edges}</div>
                <div>DAG : {result?.is_dag?'Yes':'No'}</div>
                </>}
                result={()=>setResult(null)}
                />:<></>}
        </div>
    );
};
