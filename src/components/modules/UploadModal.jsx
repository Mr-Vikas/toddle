import { useState, useEffect } from 'react';

const UploadModal = ({
  isOpen,
  onClose,
  onSave,
  moduleId,
  fileToEdit = null,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileTitle, setFileTitle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (fileToEdit) {
      setFileTitle(fileToEdit.title || '');
      const mockFile = {
        name: fileToEdit.fileName,
        size: fileToEdit.fileSize,
        type: fileToEdit.fileType,
        isPlaceholder: true,
      };
      setSelectedFile(mockFile);
    } else {
      setFileTitle('');
      setSelectedFile(null);
    }
    setError('');
  }, [fileToEdit, isOpen]);

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF, PNG, or JPEG files are allowed.');
      setSelectedFile(null);
      return;
    }

    if (file.size > maxSize) {
      setError('File size must be under 5MB.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setError('');
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!selectedFile || fileTitle.trim() === '') return;

    onSave({
      id: fileToEdit ? fileToEdit.id : Date.now().toString(),
      moduleId,
      type: 'file',
      title: fileTitle.trim(),
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      fileType: selectedFile.type,
      _fileObject: selectedFile,
    });

    setFileTitle('');
    setSelectedFile(null);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyles}>
      <div style={modalStyles}>
        <div style={headerStyles}>
          <h2 style={titleStyles}>
            {fileToEdit ? 'Edit File' : 'Upload File'}
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
              <label htmlFor="file-title" style={labelStyles}>
                File Title
              </label>
              <input
                id="file-title"
                type="text"
                value={fileTitle}
                onChange={e => setFileTitle(e.target.value)}
                placeholder="Give your file a title"
                style={inputStyles}
                autoFocus
              />
            </div>

            <div style={formGroupStyles}>
              <label htmlFor="file-upload" style={labelStyles}>
                Select File
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                style={inputStyles}
                accept="application/pdf,image/*"
              />
              {selectedFile && (
                <div style={filePreviewStyles}>
                  <span style={fileNameStyles}>{selectedFile.name}</span>
                  <span style={fileSizeStyles}>
                    ({Math.round(selectedFile.size / 1024)} KB)
                  </span>
                </div>
              )}
              {error && <p style={errorStyles}>{error}</p>}
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
                opacity: !fileTitle.trim() || !selectedFile || error ? 0.6 : 1,
                cursor:
                  !fileTitle.trim() || !selectedFile || error
                    ? 'not-allowed'
                    : 'pointer',
              }}
              disabled={!fileTitle.trim() || !selectedFile || error}
            >
              {fileToEdit ? 'Save Changes' : 'Upload'}
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

const filePreviewStyles = {
  marginTop: '6px',
  display: 'flex',
  gap: '6px',
  fontSize: '13px',
  color: '#444',
};

const fileNameStyles = {
  fontWeight: '500',
};

const fileSizeStyles = {
  color: '#888',
};

const errorStyles = {
  marginTop: '6px',
  color: 'red',
  fontSize: '13px',
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

export default UploadModal;
