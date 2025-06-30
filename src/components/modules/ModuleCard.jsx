import { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import AddOutlined from '../../assets/AddOutlined.svg';

import ModuleItem from './ModuleItem';

const ModuleCard = ({
  module,
  index,
  moveModule,
  moveItem,
  onEdit,
  onDelete,
  items = [],
  onAddItem,
  onDeleteItem,
  onEditItem,
  moduleRef,
  active = false,
}) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const moduleItems = items.filter(item => item.moduleId === module.id);
  const ref = useRef(null);

  const [, dropModule] = useDrop({
    accept: 'MODULE',
    hover(draggedItem) {
      if (draggedItem.index !== index) {
        moveModule(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [, dropResource] = useDrop({
    accept: 'RESOURCE',
    drop(draggedItem) {
      if (!moduleItems.length || draggedItem.moduleId !== module.id) {
        moveItem(draggedItem.id, null, module.id);
        draggedItem.moduleId = module.id;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'MODULE',
    item: { id: module.id, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(dropModule(dropResource(ref)));

  useEffect(() => {
    if (ref.current && typeof moduleRef === 'function') {
      moduleRef(ref.current);
    }
  }, [moduleRef]);

  const toggleOptions = e => {
    e.stopPropagation();
    setIsOptionsOpen(prev => !prev);
  };

  const toggleExpanded = () => setIsExpanded(prev => !prev);

  const handleEdit = () => {
    onEdit(module);
    setIsOptionsOpen(false);
  };

  const handleDelete = () => {
    onDelete(module.id);
    setIsOptionsOpen(false);
  };

  const handleAddClick = type => {
    onAddItem(module.id, type);
    setIsDialogOpen(false);
  };

  return (
    <div
      ref={ref}
      className={`module-card-container ${active ? 'active-module' : ''}`}
      style={{
        opacity: isDragging ? 0.4 : 1,
        border: active ? '2px solid #007bff' : '1px solid #ddd',
        borderRadius: '10px',
        marginBottom: '16px',
        backgroundColor: '#fff',
        boxShadow: '0 1px 4px rgb(255, 255, 255)',
        scrollMarginTop: '80px',
        overflow: 'visible',
        position: 'relative',
        zIndex: isOptionsOpen ? 999 : 1,
      }}
    >
      <div
        className="module-card"
        onClick={toggleExpanded}
        style={{ padding: '16px' }}
      >
        <div
          className="module-card-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            className="module-title-section"
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <span className="module-toggle" style={{ fontSize: '20px' }}>
              {isExpanded ? '▾' : '▸'}
            </span>
            <div className="module-text">
              <h3
                className="module-title"
                style={{ margin: 0, fontSize: '18px' }}
              >
                {module.name}
              </h3>
              <p
                className="module-subtitle"
                style={{ margin: 0, fontSize: '14px', color: '#666' }}
              >
                {moduleItems.length === 0
                  ? 'Add items to this module'
                  : `${moduleItems.length} item${moduleItems.length > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          <div className="module-actions" style={{ position: 'relative' }}>
            <button
              className="btn-options"
              onClick={toggleOptions}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '20px',
                cursor: 'pointer',
              }}
            >
              ⋮
            </button>
            {isOptionsOpen && (
              <div
                className="options-menu"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: '#fff',
                  border: '1px solid #ddd',
                  boxShadow: '0 2px 6px rgb(255, 255, 255)',
                  zIndex: 10,
                  borderRadius: '8px',
                }}
              >
                <button
                  className="option-item"
                  onClick={handleEdit}
                  style={{
                    padding: '10px 16px',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  Edit module
                </button>
                <button
                  className="option-item delete"
                  onClick={handleDelete}
                  style={{
                    padding: '10px 16px',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    background: 'transparent',
                    color: '#d00',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {isExpanded && (
          <div
            className="module-content-expanded"
            style={{ marginTop: '16px' }}
          >
            <div className="module-items-list">
              {moduleItems.length > 0 ? (
                moduleItems.map((item, index) => (
                  <ModuleItem
                    key={item.id}
                    item={item}
                    index={index}
                    moduleId={module.id}
                    onDelete={onDeleteItem}
                    onEdit={onEditItem}
                    moveItem={moveItem}
                  />
                ))
              ) : (
                <p
                  className="empty-module-message"
                  style={{
                    marginBottom: '12px',
                    color: '#777',
                    textAlign: 'center',
                  }}
                >
                  No content yet.
                </p>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                className="add-item-button"
                style={{
                  marginTop: '12px',
                  background: 'red',
                  color: '#fff',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
                onClick={e => {
                  e.stopPropagation();
                  setIsDialogOpen(true);
                }}
              >
                <img src={AddOutlined} /> Add item
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Item Add Dialog */}
      {isDialogOpen && (
        <div
          className="add-dialog-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgb(255, 255, 255)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setIsDialogOpen(false)}
        >
          <div
            className="add-dialog-box"
            style={{
              background: '#fff',
              borderRadius: '8px',
              padding: '24px',
              width: '100%',
              maxWidth: '400px',
              boxShadow: '0 4px 12px rgb(255, 255, 255)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '16px' }}>Add Item</h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              <button
                style={{
                  padding: '10px',
                  background: 'Red',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
                onClick={() => handleAddClick('link')}
              >
                Add Link
              </button>
              <button
                style={{
                  padding: '10px',
                  background: 'black',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
                onClick={() => handleAddClick('file')}
              >
                Upload File
              </button>
              <button
                style={{
                  padding: '10px',
                  background: '#f3f3f3',
                  color: '#333',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleCard;
