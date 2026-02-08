// src/pages/TeacherLessonEditorPage.jsx
import React, {useEffect, useState} from 'react';
// Імпортуємо наші нові функції
import { upsertLessonDetails } from '../data/lessonMaterials';
import {calculateDailyWorkload, upsertHomework} from '../data/homeworkData';
import './TeacherLessonEditorPage.css';

function TeacherLessonEditorPage({ lessonData, onBack }) {
    const dateString = lessonData.dateString;
    const homework = lessonData.homework;
    const materials = lessonData.materials;
    const lesson = lessonData.lesson;

    // Створюємо стани для всіх полів форми
    const [lessonTopic, setLessonTopic] = useState(lesson.topic || "");
    const [hwTitle, setHwTitle] = useState(homework?.title || "");
    const [hwDescription, setHwDescription] = useState(homework?.description || "");
    const [hwDeadline, setHwDeadline] = useState(homework?.deadline || "17:00");
    const [estimatedTime, setEstimatedTime] = useState(homework?.estimatedTime || 30);
    const [currentWorkload, setCurrentWorkload] = useState(0);
    const [meetingLink, setMeetingLink] = useState(materials?.meetingLink || "");

    useEffect(() => {
        // Беремо навантаження від ІНШИХ предметів
        const baseLoad = calculateDailyWorkload(dateString);

        // Додаємо навантаження від ЦЬОГО завдання (яке ми зараз створюємо)
        // Припустимо, що це завдання на 1 день (для простоти відображення піку)
        // Або можна реалізувати логіку розподілу і тут.
        // Для наочності додамо повний час, ніби учень робить все в останній день:
        setCurrentWorkload(baseLoad + parseInt(estimatedTime || 0));
    }, [dateString, estimatedTime]);

    const criticalWorkloadMinutes = 120;

    const getWorkloadStatus = (minutes) => {
        if (minutes <= criticalWorkloadMinutes/3) return { color: '#22c55e', text: 'Низьке навантаження', icon: 'sentiment_satisfied' };
        if (minutes <= criticalWorkloadMinutes/2) return { color: '#eab308', text: 'Помірне навантаження', icon: 'sentiment_neutral' };
        if (minutes <= criticalWorkloadMinutes) return { color: '#f97316', text: 'Високе навантаження', icon: 'sentiment_dissatisfied' };
        return { color: '#ef4444', text: 'КРИТИЧНЕ ПЕРЕВАНТАЖЕННЯ!', icon: 'warning' };
    };

    const status = getWorkloadStatus(currentWorkload);
    const progressPercent = Math.min((currentWorkload / criticalWorkloadMinutes) * 100, 100); // 2 години - це 100%

    const handleSave = () => {
        // 1. Зберігаємо тему уроку
        upsertLessonDetails(lesson.id, dateString, {
            topic: lessonTopic,
            description: "", // поки без опису
            meetingLink: meetingLink
        });

        // 2. Зберігаємо ДЗ (лише якщо вчитель ввів заголовок)
        if (hwTitle.trim() !== "") {
            upsertHomework(lesson.id, dateString, lesson.subject, {
                title: hwTitle,
                description: hwDescription,
                deadline: hwDeadline,
                estimatedTime: estimatedTime,
                assignedDate: dateString // припускаємо, що задано сьогодні
            });
        }

        alert('Урок збережено!');
        onBack(); // Повертаємось на попередню сторінку
    };

    return (
        <div className="lesson-editor-page">
            {/* Header (використовуємо знайомі стилі) */}
            <div className="detail-header">
                <button onClick={onBack} className="back-button">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Назад
                </button>
                <div className="detail-header-info">
                    <h1 className="detail-subject">{lesson.subject} ({lesson.class})</h1>
                    <div className="detail-meta">
                        <span className="material-symbols-outlined">calendar_today</span>
                        <span>{dateString}</span>
                        <span className="material-symbols-outlined">schedule</span>
                        <span>{lesson.time}</span>
                    </div>
                </div>
            </div>

            {/* Форма редагування */}
            <div className="editor-form-content">

                {/* Секція "Урок" */}
                <section className="detail-section">
                    <h2 className="section-title">
                        <span className="material-symbols-outlined">school</span>
                        Інформація про урок
                    </h2>
                    <div className="form-group">
                        <label htmlFor="lessonTopic">Тема уроку</label>
                        <input
                            type="text"
                            id="lessonTopic"
                            className="form-input"
                            value={lessonTopic}
                            onChange={(e) => setLessonTopic(e.target.value)}
                            placeholder="Наприклад: Логарифмічні рівняння"
                        />
                    </div>

                    <div className="form-group">
                        <label>Відеозустріч (Zoom/Meet)</label>
                        <div className="link-input-wrapper">
                            <span className="material-symbols-outlined link-icon">video_camera_front</span>
                            <input
                                type="url"
                                className="form-input with-icon"
                                value={meetingLink}
                                onChange={(e) => setMeetingLink(e.target.value)}
                                placeholder="Вставте посилання на урок..."
                            />
                        </div>
                    </div>
                </section>

                {/* Секція "Домашнє завдання" */}
                <section className="detail-section">
                    <h2 className="section-title">
                        <span className="material-symbols-outlined">assignment</span>
                        Домашнє завдання
                    </h2>

                    <div className="form-group">
                        <label htmlFor="hwTitle">Завдання</label>
                        <input
                            type="text"
                            id="hwTitle"
                            className="form-input"
                            value={hwTitle}
                            onChange={(e) => setHwTitle(e.target.value)}
                            placeholder="Наприклад: Вправа №15, ст. 34"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="hwDescription">Опис (необов'язково)</label>
                        <textarea
                            id="hwDescription"
                            className="form-textarea"
                            rows="4"
                            value={hwDescription}
                            onChange={(e) => setHwDescription(e.target.value)}
                            placeholder="Додаткові інструкції, посилання тощо..."
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="hwDeadline">Дедлайн (час)</label>
                        <input
                            type="time"
                            id="hwDeadline"
                            className="form-input short"
                            value={hwDeadline}
                            onChange={(e) => setHwDeadline(e.target.value)}
                        />
                    </div>
                    <div className="form-group" style={{flex: 1}}>
                        <label htmlFor="estTime">Час виконання (хв)</label>
                        <div className="time-input-wrapper">
                            <input
                                type="number"
                                id="estTime"
                                className="form-input"
                                value={estimatedTime}
                                onChange={(e) => setEstimatedTime(e.target.value)}
                                min="5"
                                step="5"
                            />
                            <span className="time-suffix">хв</span>
                        </div>
                    </div>

                    <div className="workload-indicator-box" style={{borderColor: status.color}}>
                        <div className="workload-header">
                            <span className="workload-title" style={{color: status.color}}>
                                <span className="material-symbols-outlined">{status.icon}</span>
                                {status.text}
                            </span>
                            <span className="workload-value">
                                ~ {Math.floor(currentWorkload / 60)} год {currentWorkload % 60} хв на клас
                        </span>
                        </div>

                        <div className="workload-progress-bg">
                            <div
                                className="workload-progress-fill"
                                style={{
                                    width: `${progressPercent}%`,
                                    backgroundColor: status.color
                                }}
                            ></div>
                        </div>

                        <p className="workload-hint">
                            Враховано ДЗ інших вчителів та розподілене навантаження довготривалих проєктів.
                        </p>
                    </div>
                </section>

                {/* Секція "Матеріали" (поки заглушка) */}
                <section className="detail-section">
                    <h2 className="section-title">
                        <span className="material-symbols-outlined">folder_open</span>
                        Матеріали до уроку
                    </h2>
                    <button className="attach-file-btn editor-attach-btn">
                        <span className="material-symbols-outlined">attach_file</span>
                        Прикріпити файл
                    </button>
                    <p className="form-hint">Тут можна буде додавати файли та посилання (як в Classroom).</p>
                </section>

                {/* Кнопка Зберегти */}
                <button className="save-lesson-btn" onClick={handleSave}>
                    <span className="material-symbols-outlined">save</span>
                    Зберегти зміни
                </button>
            </div>
        </div>
    );
}

export default TeacherLessonEditorPage;