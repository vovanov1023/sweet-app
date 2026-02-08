// src/components/TeacherLessonCard.jsx
import React from 'react';
import './TeacherLessonCard.css';

function TeacherLessonCard({ lesson, topic, homework, onClick }) {
    return (
        <div className="teacher-lesson-card" onClick={onClick}>
            {/* Час та номер */}
            <div className="lesson-time-badge">
                <div className="lesson-number-component">{lesson.lessonNumber}</div>
                <div className="lesson-time-component">{lesson.time}</div>
            </div>

            {/* Інформація про урок */}
            <div className="teacher-lesson-info">
                <div className="lesson-subject-row">
                    <h3 className="teacher-lesson-subject">{lesson.subject}</h3>
                    <span className="teacher-lesson-class">{lesson.class}</span>
                </div>

                <div className="teacher-lesson-details">
                    <div className="detail-item topic">
                        <span className="material-symbols-outlined">school</span>
                        <span>{topic || "Тему уроку не вказано"}</span>
                    </div>
                    <div className={`detail-item homework ${homework ? 'set' : 'not-set'}`}>
                        <span className="material-symbols-outlined">assignment</span>
                        <span>{homework ? "ДЗ видано" : "ДЗ не видано"}</span>
                    </div>
                </div>
            </div>

            {/* Кнопка "Редагувати" */}
            <div className="edit-button-wrapper">
                <span className="material-symbols-outlined">edit</span>
            </div>
        </div>
    );
}

export default TeacherLessonCard;