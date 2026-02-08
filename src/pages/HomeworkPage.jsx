// src/pages/HomeworkPage.jsx
import React, { useState } from 'react';
import { getAllHomework } from '../data/homeworkData';
import './HomeworkPage.css';

function HomeworkPage({ onNavigateToLesson }) {
    const [activeTab, setActiveTab] = useState('active'); // 'active' або 'completed'
    const [selectedFilter, setSelectedFilter] = useState('all'); // Моковий фільтр

    const allHomework = getAllHomework();

    // Розділяємо завдання
    const activeHomework = allHomework.filter(hw => !hw.completed);
    const completedHomework = allHomework.filter(hw => hw.completed);

    const displayList = activeTab === 'active' ? activeHomework : completedHomework;

    // Мокові предмети для фільтру
    const subjects = ['Всі', 'Алгебра', 'Укр. мова', 'Фізика', 'Історія'];

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const DateStatus = {
        PAST: 0,
        TODAY: 1,
        TOMORROW: 2,
        FUTURE: 3
    }

    const getDateStatus = (date) => {
        const dateStr = date.toDateString();

        if (dateStr === tomorrow.toDateString()) return DateStatus.TOMORROW;
        if (dateStr === today.toDateString()) return DateStatus.TODAY;

        return date < today ? DateStatus.PAST : DateStatus.FUTURE;

    }

    // Утиліта для гарного відображення дати
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const dateStatus = getDateStatus(date);

        if (dateStatus === DateStatus.PAST) return `В минулому (${date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })})`;
        if (dateStatus === DateStatus.TODAY) return 'Сьогодні';
        if (dateStatus === DateStatus.TOMORROW) return 'Завтра';

        return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' });
    };

    return (
        <div className="homework-page">

            {/* Вкладки */}
            <div className="hw-tabs">
                <button
                    className={`hw-tab ${activeTab === 'active' ? 'active' : ''}`}
                    onClick={() => setActiveTab('active')}
                >
                    Актуальні
                    {activeHomework.length > 0 && <span className="hw-count-badge">{activeHomework.length}</span>}
                </button>
                <button
                    className={`hw-tab ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    Виконані
                </button>
            </div>

            {/* Мокові фільтри */}
            <div className="hw-filters">
                {subjects.map(subj => (
                    <button
                        key={subj}
                        className={`filter-chip ${selectedFilter === subj ? 'selected' : ''}`}
                        onClick={() => setSelectedFilter(subj)}
                    >
                        {subj}
                    </button>
                ))}
            </div>

            {/* Список завдань */}
            <div className="hw-list">
                {displayList.length > 0 ? (
                    displayList.map(hw => (
                        <div
                            key={hw.id}
                            className="hw-card"
                            onClick={() => onNavigateToLesson(hw.lessonId, hw.date, 'assignments')}
                        >
                            <div className="hw-card-header">
                                <span className="hw-subject">{hw.subject}</span>
                                <span className={`hw-deadline ${activeTab === 'active' ? (getDateStatus(new Date(hw.date)) === DateStatus.FUTURE ?  'urgent' : 'overdue') : ''}`}>
                                    <span className="material-symbols-outlined">event</span>
                                    {formatDate(hw.date)}, до {hw.deadline}
                                </span>
                            </div>

                            <h3 className="hw-title">{hw.title}</h3>
                            <p className="hw-description">{hw.description}</p>

                            <div className="hw-footer">
                                <span className="material-symbols-outlined arrow-icon">chevron_right</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-hw-state">
                        <span className="material-symbols-outlined">check_circle</span>
                        <p>{activeTab === 'active' ? 'Усі завдання виконано!' : 'Архів порожній'}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomeworkPage;