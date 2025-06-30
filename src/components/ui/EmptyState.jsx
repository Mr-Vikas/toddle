import emptyImage from '../../assets/Resources.svg';

const EmptyState = () => {
  return (
    <div style={containerStyles}>
      <div style={imageWrapperStyles}>
        <img src={emptyImage} alt="Empty illustration" style={imageStyles} />
      </div>
      <h2 style={titleStyles}>Nothing added here yet</h2>
      <p style={descriptionStyles}>
        Click on the <span style={plusStyles}>+</span> <strong>Add</strong>{' '}
        button to add items to this course.
      </p>
    </div>
  );
};

// === Inline Styles ===

const containerStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px 24px',
  backgroundColor: 'rgba(232, 232, 232, 0.8)',
  border: '2px solid #e0e7ef',
  borderRadius: '16px',
  textAlign: 'center',
  marginTop: '40px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
};

const imageWrapperStyles = {
  marginBottom: '24px',
};

const imageStyles = {
  width: '100px',
  height: 'auto',
  opacity: 0.85,
};

const titleStyles = {
  fontSize: '22px',
  fontWeight: '700',
  color: '#2d3a4a',
  marginBottom: '10px',
};

const descriptionStyles = {
  fontSize: '15px',
  color: '#4a5a6a',
  marginBottom: '18px',
};

const plusStyles = {
  color: '#1976d2',
  fontWeight: 'bold',
  fontSize: '18px',
};

export default EmptyState;
