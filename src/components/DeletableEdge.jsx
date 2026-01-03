import { BaseEdge, EdgeLabelRenderer, getBezierPath } from 'reactflow';

export default function DeletableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
            background: '#fff',
            borderRadius: '50%',
            padding: 4,
            boxShadow: '0 0 4px rgba(0,0,0,0.3)',
            cursor: 'pointer',
          }}
          onClick={() => data.onDelete(id)}
        >
        <span className="material-symbols-outlined !text-[18px] text-red-500 ml-auto cursor-pointer">close</span>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
