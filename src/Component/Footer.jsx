import React, { useState } from 'react';

export default function Footer({ centerContent }) {
    const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'ko');

    const handleLangChange = (newLang) => {
        setLang(newLang);
        localStorage.setItem('lang', newLang);
    };

    return (
        <footer
        style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            minWidth: '900px',
            width: '100%',
            height: '60px',
            padding: '20px',
            backgroundColor: 'transparent',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 1000,
        }}
        >
        {/* 언어 선택 */}
        <div style={{ display: 'flex', gap: '10px' }}>
            <button
            style={langButtonStyle(lang === 'ko')}
            onClick={() => handleLangChange('ko')}
            >
            한국어
            </button>
            <button
            style={langButtonStyle(lang === 'en')}
            onClick={() => handleLangChange('en')}
            >
            English
            </button>
        </div>

        {/* 중앙 콘텐츠 */}
        <div
            style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            }}
        >
            {centerContent}
        </div>

        {/* 오른쪽: 고정 텍스트 */}
        <div style={{ fontSize: '13px', color: '#888' }}>
            © 2025 Seoul Festa
        </div>
        </footer>
    );
    }

    const langButtonStyle = (active) => ({
    backgroundColor: active ? '#4285f4' : 'transparent',
    color: active ? '#fff' : '#888',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    });
