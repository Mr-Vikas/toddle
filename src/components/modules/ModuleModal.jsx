import { useState, useEffect } from 'react';

const ModuleModal = ({ isOpen, onClose, onSave, module = null }) => {
  const [moduleName, setModuleName] = useState('');

  useEffect(() => {
    setModuleName(module ? module.name : '');
  }, [module]);

  const handleSubmit = e => {
    e.preventDefault();

    if (moduleName.trim() === '') {
      alert('Module name cannot be empty');
      return;
    }

    onSave({
      id: module ? module.id : Date.now().toString(),
      name: moduleName.trim(),
    });

    setModuleName('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={overlayStyles}>
      <div className="modal-content" style={modalStyles}>
        <div className="modal-header" style={headerStyles}>
          <h2 style={titleStyles}>
            {module ? 'Edit Module' : 'Create New Module'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={closeButtonStyles}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ marginBottom: '20px' }}>
            <div className="form-group" style={formGroupStyles}>
              <label htmlFor="module-name" style={labelStyles}>
                Module Name
              </label>
              <input
                id="module-name"
                type="text"
                value={moduleName}
                onChange={e => setModuleName(e.target.value)}
                placeholder="Introduction to Trigonometry"
                autoFocus
                style={inputStyles}
              />
            </div>
          </div>

          <div className="modal-footer" style={footerStyles}>
            <button type="button" onClick={onClose} style={cancelButtonStyles}>
              Cancel
            </button>
            <button
              type="submit"
              style={{
                ...createButtonStyles,
                opacity: moduleName.trim() === '' ? 0.6 : 1,
                cursor: moduleName.trim() === '' ? 'not-allowed' : 'pointer',
              }}
              disabled={moduleName.trim() === ''}
            >
              {module ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// === Inline Styles ===

const overlayStyles = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyles = {
  background: '#fff',
  borderRadius: '8px',
  width: '100%',
  maxWidth: '500px',
  padding: '24px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};

const headerStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
};

const titleStyles = {
  fontSize: '20px',
  fontWeight: '600',
  margin: 0,
};

const closeButtonStyles = {
  fontSize: '24px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  lineHeight: '1',
  color: '#555',
};

const formGroupStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  marginBottom: '16px',
};

const labelStyles = {
  fontSize: '14px',
  fontWeight: '500',
};

const inputStyles = {
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '14px',
};

const footerStyles = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
};

const cancelButtonStyles = {
  background: '#f3f3f3',
  color: '#333',
  padding: '8px 16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const createButtonStyles = {
  background: 'red',
  color: '#fff',
  padding: '8px 16px',
  border: 'none',
  borderRadius: '6px',
};

export default ModuleModal;
