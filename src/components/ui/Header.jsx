import { useState, useRef, useEffect } from 'react';

import AddOutlined from '../../assets/AddOutlined.svg';
import LinkOutlined from '../../assets/LinkOutlined.svg';
import SinglePointRubric from '../../assets/SinglePointRubric.svg';
import UploadOutlined from '../../assets/UploadOutlined.svg';
const Header = ({ onAddClick, onSearch }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddClick = () => setIsDropdownOpen(!isDropdownOpen);
  const handleCreateModule = () => {
    onAddClick('module');
    setIsDropdownOpen(false);
  };
  const handleAddLink = () => {
    onAddClick('link');
    setIsDropdownOpen(false);
  };
  const handleUpload = () => {
    onAddClick('upload');
    setIsDropdownOpen(false);
  };
  const handleSearchChange = e => onSearch(e.target.value);

  return (
    <div style={headerStyles}>
      <h1 style={titleStyles}> Course Builder</h1>
      <div style={rightSectionStyles}>
        <input
          type="text"
          placeholder="Search modules or items..."
          onChange={handleSearchChange}
          style={searchInputStyles}
        />

        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button onClick={handleAddClick} style={addButtonStyles}>
            <img src={AddOutlined} /> Add
          </button>

          {isDropdownOpen && (
            <div style={dropdownMenuStyles}>
              <button onClick={handleCreateModule} style={dropdownItemStyles}>
                <img src={SinglePointRubric} /> Create Module
              </button>
              <button onClick={handleAddLink} style={dropdownItemStyles}>
                <img src={LinkOutlined} /> Add Link
              </button>
              <button onClick={handleUpload} style={dropdownItemStyles}>
                <img src={UploadOutlined} /> Upload File
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// === Inline Styles ===
const headerStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 40px',
  borderBottom: '2px solid #e0e0e0',
  background: 'linear-gradient(90deg, #f8fafc 0%,rgb(251, 251, 251) 100%)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
};

const titleStyles = {
  fontSize: '26px',
  fontWeight: '700',
  color: 'black',
  margin: 0,
  letterSpacing: '1px',
};

const rightSectionStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '18px',
};

const searchInputStyles = {
  padding: '10px 16px',
  borderRadius: '8px',
  border: '1.5px solidrgb(101, 101, 101)',
  fontSize: '15px',
  width: '260px',
  background: '#f4f8fb',
  outline: 'none',
  transition: 'border 0.2s',
};

const addButtonStyles = {
  padding: '10px 20px',
  background:
    'linear-gradient(90deg,rgb(231, 20, 20) 0%,rgb(240, 81, 84) 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: '600',
  cursor: 'pointer',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
  transition: 'background 0.2s',
};

const dropdownMenuStyles = {
  position: 'absolute',
  top: '115%',
  right: 0,
  background: '#fff',
  border: '1.5px solid #b3c6e0',
  borderRadius: '10px',
  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
  width: '200px',
  padding: '10px 0',
  zIndex: 1000,
};

const dropdownItemStyles = {
  width: '100%',
  textAlign: 'left',
  padding: '12px 20px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: '15px',
  color: 'black',
  fontWeight: '500',
  transition: 'background 0.18s',
};

export default Header;
