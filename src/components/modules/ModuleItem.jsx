import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const extractYouTubeID = url => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v');
    } else if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.substring(1);
    }
  } catch {
    return null;
  }
};

const ModuleItem = ({ item, index, moduleId, onDelete, onEdit, moveItem }) => {
  const ref = useRef(null);
  const isLink = item.type === 'link';

  const [, drop] = useDrop({
    accept: 'RESOURCE',
    hover(draggedItem, monitor) {
      if (!ref.current || draggedItem.id === item.id) return;

      const hoverRect = ref.current.getBoundingClientRect();
      const middleY = (hoverRect.bottom - hoverRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverRect.top;

      const isDraggingDown = draggedItem.index < index;

      if (
        draggedItem.moduleId !== moduleId ||
        (draggedItem.index !== index &&
          ((isDraggingDown && hoverClientY > middleY) ||
            (!isDraggingDown && hoverClientY < middleY)))
      ) {
        moveItem(draggedItem.id, item.id, moduleId);
        draggedItem.index = index;
        draggedItem.moduleId = moduleId;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'RESOURCE',
    item: { ...item, index, moduleId },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const handleDelete = e => {
    e.stopPropagation();
    onDelete(item.id);
  };

  const handleEdit = e => {
    e.stopPropagation();
    onEdit(item);
  };

  const handleFileOpen = e => {
    e.stopPropagation();
    if (item._fileObject) {
      const fileURL = URL.createObjectURL(item._fileObject);
      window.open(fileURL, '_blank');
    } else {
      alert('File preview not available. Try re-uploading.');
    }
  };

  const youtubeId = isLink ? extractYouTubeID(item.url) : null;

  return (
    <div
      ref={ref}
      className={`module-item ${isLink ? 'link-item' : 'file-item'}`}
      style={{
        opacity: isDragging ? 0.4 : 1,
        transition: 'opacity 0.2s ease',
        cursor: 'move',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '12px',
        background: '#fff',
        marginBottom: '10px',
      }}
    >
      <div
        className="item-content"
        onClick={!isLink ? handleFileOpen : undefined}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}
      >
        <div className="item-icon">
          {isLink && youtubeId ? (
            <img
              src={`https://img.youtube.com/vi/${youtubeId}/0.jpg`}
              alt="YouTube thumbnail"
              style={{
                width: '48px',
                height: '36px',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
          ) : (
            <span style={{ fontSize: '20px' }}>{isLink ? '🔗' : '📄'}</span>
          )}
        </div>

        <div className="item-info" style={{ flex: 1 }}>
          <h4
            className="item-title"
            style={{
              fontSize: '16px',
              margin: 0,
              fontWeight: '500',
              wordBreak: 'break-word',
            }}
          >
            {item.title}
          </h4>
          {isLink ? (
            <a
              href={item.url}
              className="item-url"
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                fontSize: '14px',
                color: 'black',
                textDecoration: 'none',
              }}
            >
              {item.url}
            </a>
          ) : (
            <p
              className="item-details"
              style={{ fontSize: '14px', color: '#555', margin: 0 }}
            >
              {item.fileName} ({Math.round(item.fileSize / 1024)} KB)
            </p>
          )}
        </div>
      </div>

      <div
        className="item-actions"
        style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}
      >
        <button
          className="item-action"
          onClick={handleEdit}
          title="Edit"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'grey',
            cursor: 'pointer',
          }}
        >
          Edit
        </button>
        <button
          className="item-action"
          onClick={handleDelete}
          title="Delete"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#d00',
            cursor: 'pointer',
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ModuleItem;
