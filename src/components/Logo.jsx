import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

function Logo({ size = 'medium', showText = true }) {
  const { theme } = useTheme();
  
  const sizes = {
    small: { width: '32px', height: '32px', fontSize: '0.9rem' },
    medium: { width: '40px', height: '40px', fontSize: '1.1rem' },
    large: { width: '60px', height: '60px', fontSize: '1.5rem' }
  };

  const logoStyle = {
    width: sizes[size].width,
    height: sizes[size].height,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: sizes[size].fontSize,
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
  };

  return (
    <div className="d-flex align-items-center">
      <div style={logoStyle}>
        🧠
      </div>
      {showText && (
        <div className={`ms-2 ${theme.text}`}>
          <span className="fw-bold" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: sizes[size].fontSize 
          }}>
            CogniBridge
          </span>
          <div className={`small ${theme.textMuted}`} style={{ fontSize: '0.7rem', marginTop: '-2px' }}>
            Autism Therapy Platform
          </div>
        </div>
      )}
    </div>
  );
}

export default Logo;
