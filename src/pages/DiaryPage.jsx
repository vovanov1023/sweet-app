import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import './DiaryPage.css';
import { getScheduleForDate, formatDate, formatShortDate } from '../data/scheduleData';
import { getHomeworkForLesson, getIncompleteHomeworkCount } from '../data/homeworkData';
import LessonCard from '../components/LessonCard';
import { getMaterialsForLesson } from "../data/lessonMaterials";
import {getGradeForLesson} from "../data/gradesData";

function DiaryPage({ onLessonClick, initialDate }) {
    const [currentDate, setCurrentDate] = useState(initialDate || new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

    // Отримання розкладу на поточний день
    const schedule = getScheduleForDate(currentDate);

    return (
        <div className="diary-page-new">
            {/* Header з датою */}
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

                <button onClick={() => setIsCalendarOpen(true)} className="calendar-btn">
                    <span className="material-symbols-outlined">calendar_month</span>
                </button>
            </div>

            {/* Розклад */}
            <div className="schedule-container" {...swipeHandlers}>
                {schedule.length === 0 ? (
                    <div className="no-lessons">
                        <span className="material-symbols-outlined">event_busy</span>
                        <p>Вихідний день</p>
                        <p className="no-lessons-subtitle">Насолоджуйся відпочинком! 🎉</p>
                    </div>
                ) : (
                    <div className="lessons-list-diary">
                        {schedule.map((lesson) => {
                            const dateString = formatShortDate(currentDate);
                            const homework = getHomeworkForLesson(lesson.id, dateString);
                            const lessonDetails = getMaterialsForLesson(lesson.id, dateString);
                            const grade = getGradeForLesson(lesson.subject, dateString, lesson.id);

                            return (
                                <LessonCard
                                    key={lesson.id}
                                    lessonNumber={lesson.lessonNumber}
                                    subject={lesson.subject}
                                    time={lesson.time}
                                    room={lesson.room}
                                    homework={homework}
                                    showDetails={true}

                                    teacher={lesson.teacher}
                                    topic={lessonDetails?.topic}
                                    materials={lessonDetails?.materials}
                                    grade={grade}
                                    meetingLink={lessonDetails?.meetingLink}

                                    onClick={() => onLessonClick && onLessonClick(lesson, homework, dateString, 'diary')}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Модальне вікно календаря */}
            {isCalendarOpen && (
                <CalendarModal
                    currentDate={currentDate}
                    onSelectDate={(date) => {
                        setCurrentDate(date);
                        setIsCalendarOpen(false);
                    }}
                    onClose={() => setIsCalendarOpen(false)}
                />
            )}
        </div>
    );
}

// Компонент календаря
function CalendarModal({ currentDate, onSelectDate, onClose }) {
    const [viewDate, setViewDate] = useState(new Date(currentDate));

    // Генерація днів місяця
    const generateCalendar = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const days = [];
        const startPadding = (firstDay.getDay() + 6) % 7; // Понеділок = 0

        // Додаємо порожні дні на початку
        for (let i = 0; i < startPadding; i++) {
            days.push(null);
        }

        // Додаємо дні місяця
        for (let day = 1; day <= lastDay.getDate(); day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const previousMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(viewDate.getMonth() - 1);
        setViewDate(newDate);
    };

    const nextMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(viewDate.getMonth() + 1);
        setViewDate(newDate);
    };

    const calendar = generateCalendar();
    const monthName = viewDate.toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' });
    const today = formatShortDate(new Date());

    return (
        <div className="calendar-modal-overlay" onClick={onClose}>
            <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
                <div className="calendar-modal-header">
                    <button onClick={previousMonth} className="calendar-nav-btn">
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <h3 className="calendar-modal-title">{monthName}</h3>
                    <button onClick={nextMonth} className="calendar-nav-btn">
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>

                <div className="calendar-weekdays">
                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map(day => (
                        <div key={day} className="calendar-weekday">{day}</div>
                    ))}
                </div>

                <div className="calendar-days">
                    {calendar.map((date, index) => {
                        if (!date) {
                            return <div key={`empty-${index}`} className="calendar-day-empty" />;
                        }

                        const dateStr = formatShortDate(date);
                        const homeworkCount = getIncompleteHomeworkCount(dateStr);
                        const isToday = dateStr === today;
                        const isSelected = formatShortDate(date) === formatShortDate(currentDate);

                        return (
                            <button
                                key={dateStr}
                                onClick={() => onSelectDate(date)}
                                className={`calendar-day-btn ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                            >
                                <span className="day-number-calendar">{date.getDate()}</span>
                                {homeworkCount > 0 && (
                                    <span className="homework-count-badge">{homeworkCount}</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <button onClick={onClose} className="calendar-close-btn">
                    Закрити
                </button>
            </div>
        </div>
    );
}

export default DiaryPage;