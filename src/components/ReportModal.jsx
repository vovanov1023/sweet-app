// src/components/ReportModal.jsx
import React from 'react';
import './ReportModal.css';

function ReportModal({ isOpen, onClose, text, studentName }) {
    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        alert("Текст скопійовано в буфер обміну!");
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>📊 Аналіз успішності: {studentName}</h3>
                    <button className="close-btn" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="modal-body">
                    <textarea
                        readOnly
                        value={text}
                        className="report-textarea"
                    />
                </div>

                <div className="modal-footer">
                    <button className="secondary-btn" onClick={onClose}>Закрити</button>
                    <button className="primary-btn" onClick={handleCopy}>
                        <span className="material-symbols-outlined">content_copy</span>
                        Копіювати звіт
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReportModal;