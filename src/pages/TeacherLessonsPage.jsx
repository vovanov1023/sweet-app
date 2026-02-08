// src/pages/TeacherLessonsPage.jsx
import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { getTeacherScheduleForDate } from '../data/teacherScheduleData';
import { getHomeworkForLesson } from '../data/homeworkData';
import { getMaterialsForLesson } from '../data/lessonMaterials';
import { formatDate, formatShortDate } from '../data/scheduleData'; // Використовуємо функції форматування
import TeacherLessonCard from '../components/TeacherLessonCard';
import './TeacherLessonsPage.css';
import './DiaryPage.css'

function TeacherLessonsPage({ onLessonSelect }) { // Приймаємо обробник
    const [currentDate, setCurrentDate] = useState(new Date(/*"2025-11-03"*/));

    // Навігація по днях
    const goToPreviousDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 1);
        setCurrentDate(newDate);
    };

    const goToNextDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 1);
        setCurrentDate(newDate);
    };

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => goToNextDay(),
        onSwipedRight: () => goToPreviousDay()
    });

    const schedule = getTeacherScheduleForDate(currentDate);
    const dateString = formatShortDate(currentDate);

    return (
        <div className="teacher-lessons-page">
            {/* Header з датою (використовуємо стилі з DiaryPage) */}
            <div className="diary-header">
                <button onClick={goToPreviousDay} className="date-nav-btn">
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <div className="current-date">
                    {formatDate(currentDate)}
                </div>
                <button onClick={goToNextDay} className="date-nav-btn">
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
                <button className="calendar-btn">
                    <span className="material-symbols-outlined">calendar_month</span>
                </button>
            </div>

            {/* Список уроків */}
            <div className="teacher-lessons-list" {...swipeHandlers}>
                {schedule.length === 0 ? (
                    <div className="no-lessons">
                        <span className="material-symbols-outlined">event_busy</span>
                        <p>Вихідний день</p>
                    </div>
                ) : (
                    schedule.map((lesson) => {
                        const homework = getHomeworkForLesson(lesson.id, dateString);
                        const materials = getMaterialsForLesson(lesson.id, dateString);

                        return (
                            <TeacherLessonCard
                                key={lesson.id}
                                lesson={lesson}
                                topic={materials?.topic}
                                homework={homework}
                                onClick={() => onLessonSelect(lesson, dateString)}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default TeacherLessonsPage;