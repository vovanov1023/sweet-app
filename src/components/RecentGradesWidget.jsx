// src/components/RecentGradesWidget.jsx
import React from 'react';
import { getRecentGrades } from '../data/gradesData';
import './DashboardWidget.css'; // Використовуємо спільні стилі

function RecentGradesWidget({ onGradesClick, onNavigateToLesson }) {
    const grades = getRecentGrades(3);

    return (
        <div className="widget-card">
            <div className="widget-title-container">
                <h3 className="widget-title">
                    <span className="material-symbols-outlined">grade</span>
                    Останні Оцінки
                </h3>
                {/* Ця кнопка буде вести на сторінку "Успішність" */}
                <button onClick={onGradesClick} className="widget-see-all-btn">Всі</button>
            </div>
            <div className="widget-list">
                {grades.length > 0 ? grades.map(grade => (
                    <button
                        key={grade.id}
                        className="widget-list-item as-button"
                        onClick={() => onNavigateToLesson(grade.lessonId, grade.date, 'widget-grades')}
                    >
                        <div className="icon-wrapper">
                            <span className="material-symbols-outlined">school</span>
                        </div>
                        <div className="text-content">
                            <span className="primary-text">{grade.subject}</span>
                            <span className="secondary-text">{grade.type} | {grade.date}</span>
                        </div>
                        <span className="grade-badge">{grade.grade}</span>
                    </button>
                )) : (
                    <span className="secondary-text">Нових оцінок ще немає.</span>
                )}
            </div>
        </div>
    );
}

export default RecentGradesWidget;