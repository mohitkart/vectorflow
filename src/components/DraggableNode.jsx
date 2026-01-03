export const DraggableNode = ({ type, label ,icon}) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <div
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        className={`${type} cursor-grab px-4 py-2 bg-white border border-blue-500 text-blue-500 rounded text-[12px] flex gap-1 items-center hover:shadow-lg hover:scale-105`}
        draggable
      >
        {icon} <span>{label}</span>
      </div>
    );
  };
  