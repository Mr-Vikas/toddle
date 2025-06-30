const Outline = ({ modules, activeModuleId, onScrollTo }) => {
  if (!modules.length) return null;

  return (
    <div style={sidebarStyles}>
      <h3 style={titleStyles}>Outline</h3>
      <ul style={listStyles}>
        {modules.map((mod) => (
          <li
            key={mod.id}
            onClick={() => onScrollTo(mod.id)}
            style={{
              ...itemStyles,
              ...(mod.id === activeModuleId ? activeItemStyles : {}),
            }}
          >
            {mod.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

// === Inline Styles ===

const sidebarStyles = {
  width: '240px',
  borderRight: '1px solid #eee',
  padding: '24px 16px',
  backgroundColor: '#fafafa',
  height: '100vh',
  overflowY: 'auto',
};

const titleStyles = {
  fontSize: '16px',
  fontWeight: '600',
  marginBottom: '16px',
  color: '#333',
};

const listStyles = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

const itemStyles = {
  padding: '10px 14px',
  borderRadius: '6px',
  cursor: 'pointer',
  marginBottom: '8px',
  fontSize: '14px',
  color: '#444',
  transition: 'background 0.2s',
};

const activeItemStyles = {
  backgroundColor: '#e0f0ff',
  color: '#007bff',
  fontWeight: '600',
};

export default Outline;
