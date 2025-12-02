'use client';

import { useState, useEffect } from 'react';
import { getCurrentLanguage, setLanguage, getAvailableLanguages } from '../lib/i18n';

const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState('en');
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentLang(getCurrentLanguage());
    
    // Listen for language changes
    const handleLanguageChange = (event) => {
      setCurrentLang(event.detail.language);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  const handleLanguageChange = (langCode) => {
    if (setLanguage(langCode)) {
      setCurrentLang(langCode);
      setIsOpen(false);
      // Force page reload to update all text
      window.location.reload();
    }
  };

  const languages = getAvailableLanguages();
  const currentLanguage = languages.find(lang => lang.code === currentLang);

  if (!isClient) {
    return null;
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          color: '#6b7280',
          fontSize: '12px',
          fontWeight: '500',
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '4px',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#f3f4f6';
          e.target.style.color = '#374151';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.color = '#6b7280';
        }}
      >
        <span>{currentLanguage?.nativeName || 'EN'}</span>
        <span style={{ fontSize: '10px' }}>▼</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              zIndex: 1000,
              minWidth: '120px',
              marginTop: '4px'
            }}
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: 'none',
                  background: currentLang === language.code ? '#fef2f2' : 'transparent',
                  color: currentLang === language.code ? '#dc2626' : '#374151',
                  fontSize: '12px',
                  fontWeight: currentLang === language.code ? '600' : '400',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => {
                  if (currentLang !== language.code) {
                    e.target.style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentLang !== language.code) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span>{language.nativeName}</span>
                {currentLang === language.code && (
                  <span style={{ fontSize: '10px', color: '#dc2626' }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;














