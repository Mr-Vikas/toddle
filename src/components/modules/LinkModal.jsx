import { useState, useEffect } from 'react';

const LinkModal = ({
  isOpen,
  onClose,
  onSave,
  moduleId,
  linkToEdit = null,
}) => {
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  useEffect(() => {
    if (linkToEdit) {
      setLinkTitle(linkToEdit.title);
      setLinkUrl(linkToEdit.url);
    } else {
      setLinkTitle('');
      setLinkUrl('');
    }
  }, [linkToEdit, isOpen]);

  const handleSubmit = e => {
    e.preventDefault();

    try {
      new URL(linkUrl.trim());
    } catch {
      alert('Please enter a valid URL.');
      return;
    }

    onSave({
      id: linkToEdit ? linkToEdit.id : Date.now().toString(),
      moduleId,
      type: 'link',
      title: linkTitle.trim(),
      url: linkUrl.trim(),
    });

    setLinkTitle('');
    setLinkUrl('');
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyles}>
      <div style={modalStyles}>
        <div style={headerStyles}>
          <h2 style={titleStyles}>
            {linkToEdit ? 'Edit Link' : 'Add a New Link'}
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
          <div style={{ marginBottom: '20px' }}>
            <div style={formGroupStyles}>
              <label htmlFor="link-title" style={labelStyles}>
                Link Title
              </label>
              <input
                id="link-title"
                type="text"
                value={linkTitle}
                onChange={e => setLinkTitle(e.target.value)}
                placeholder="Enter a title (e.g. Intro Video)"
                autoFocus
                style={inputStyles}
              />
            </div>

            <div style={formGroupStyles}>
              <label htmlFor="link-url" style={labelStyles}>
                URL
              </label>
              <input
                id="link-url"
                type="url"
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                style={inputStyles}
              />
            </div>
          </div>

          <div style={footerStyles}>
            <button type="button" onClick={onClose} style={cancelButtonStyles}>
              Cancel
            </button>
            <button
              type="submit"
              style={{
                ...createButtonStyles,
                opacity: !linkTitle.trim() || !linkUrl.trim() ? 0.6 : 1,
                cursor:
                  !linkTitle.trim() || !linkUrl.trim()
                    ? 'not-allowed'
                    : 'pointer',
              }}
              disabled={!linkTitle.trim() || !linkUrl.trim()}
            >
              {linkToEdit ? 'Save Changes' : 'Add Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// === Styles ===

const overlayStyles = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyles = {
  background: '#fff',
  borderRadius: '8px',
  maxWidth: '500px',
  width: '100%',
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

export default LinkModal;
