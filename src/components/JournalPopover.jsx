// src/components/JournalPopover.js
import React from 'react';
import './JournalPopover.css';

function JournalPopover({ isOpen, onClose, position, title, children }) {
    if (!isOpen) return null;

    return (
        <>
            {/* Прозорий фон на весь екран, щоб закрити модалку при кліку поза нею */}
            <div className="popover-overlay" onClick={onClose} />

            <div
                className="popover-content"
                style={{
                    top: position.y,
                    left: position.x
                }}
            >
                {title && <div className="popover-title">{title}</div>}
                <div className="popover-body">
                    {children}
                </div>
            </div>
        </>
    );
}

export default JournalPopover;