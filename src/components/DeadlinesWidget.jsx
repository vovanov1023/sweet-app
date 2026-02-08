// src/components/DeadlinesWidget.jsx
import React from 'react';
import { getUpcomingDeadlines } from '../data/homeworkData';
import './DashboardWidget.css'; // Використовуємо спільні стилі

// Утиліта для форматування дати
const formatDeadlineDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('uk-UA', { month: 'short' }).replace('.', '');
    return { day, month };
};

function DeadlinesWidget({ onNavigateToLesson, onAssignmentsClick }) {
    const deadlines = getUpcomingDeadlines(3);

    return (
        <div className="widget-card">
            <div className="widget-title-container">
                <h3 className="widget-title">
                    <span className="material-symbols-outlined">rocket_launch</span>
                    Найближчі Дедлайни
                </h3>
                <button className="widget-see-all-btn" onClick={onAssignmentsClick}>Всі</button>
            </div>
            <div className="widget-list">
                {deadlines.length > 0 ? deadlines.map(hw => {
                    const { day, month } = formatDeadlineDate(hw.date);
                    return (
                        <button
                            key={hw.id}
                            className="widget-list-item as-button" // Додамо клас для стилів
                            onClick={() => onNavigateToLesson(hw.lessonId, hw.date, 'widget-deadlines')}
                        >
                            <div className="date-badge">
                                <span className="day">{day}</span>
                                <span className="month">{month}</span>
                            </div>
                            <div className="text-content">
                                <span className="primary-text">{hw.title}</span>
                                <span className="secondary-text">{hw.subject}</span>
                            </div>
                        </button>
                    );
                }) : (
                    <span className="secondary-text">Невиконаних завдань немає.</span>
                )}
            </div>
        </div>
    );
}

export default DeadlinesWidget;