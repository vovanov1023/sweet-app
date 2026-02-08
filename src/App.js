import React, { useState } from 'react';
import './App.css';
import DiaryPage from './pages/DiaryPage';
import LessonDetailPage from './pages/LessonDetailPage';
import LessonCard from "./components/LessonCard";
import {formatShortDate, getScheduleForDate} from "./data/scheduleData";
import {getHomeworkForLesson} from "./data/homeworkData";
import GradesPage from "./pages/GradesPage";
import SubjectDetailPage from './pages/SubjectDetailPage';
import DeadlinesWidget from './components/DeadlinesWidget';
import RecentGradesWidget from './components/RecentGradesWidget';
import './components/DashboardWidget.css';
import { getMaterialsForLesson } from "./data/lessonMaterials";
import {getAllGrades, getGradeForLesson} from "./data/gradesData";
import TeacherJournalPage from './pages/TeacherJournalPage';
import TeacherLessonsPage from './pages/TeacherLessonsPage';
import './pages/DiaryPage.css';
import TeacherLessonEditorPage from './pages/TeacherLessonEditorPage';
import './pages/LessonDetailPage.css';
import { newsData } from './data/newsData';
import TeacherNotificationsPage from './pages/TeacherNotificationsPage';
import LoginPage from './pages/LoginPage';
import {downloadScheduleICS} from "./utils/icsGenerator";
import HomeworkPage from "./pages/HomeworkPage";

function HeaderContent({ title, onLogout }) {
    return (
        <div className="header-content">
            <span className="material-symbols-outlined icon">menu</span>
            <h1 className="header-title">{title}</h1>
            <img src={"images/header/profile.svg"} alt="profileIcon" className="icon" onClick={onLogout} />
        </div>
    );
}

const currentDate = new Date(/*"2025-11-03"*/);
const schedule = getScheduleForDate(currentDate);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, (err) => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Компонент головної сторінки
function HomePage({ onLessonClick, onGradesClick, onNavigateToLesson, onAssignmentsClick }) {
    return (
        <>
            <div className="page-title" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h2>Розклад на сьогодні</h2>

                {/* === КНОПКА ЕКСПОРТУ === */}
                <button
                    onClick={downloadScheduleICS}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '14px',
                        fontWeight: '600'
                    }}
                    title="Додати розклад у Google/Apple Календар"
                >
                    <span className="material-symbols-outlined">ios_share</span>
                    Експорт
                </button>
            </div>

            <div className="lessons-list">
                {
                    schedule.length === 0 ? (
                        <div className="no-lessons">
                            <span className="material-symbols-outlined">event_busy</span>
                            <p>Вихідний день</p>
                            <p className="no-lessons-subtitle">Насолоджуйся відпочинком! 🎉</p>
                        </div>
                    ) : (
                        schedule.map((lesson) => {
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
                                    showDetails={false}
                                    meetingLink={lessonDetails?.meetingLink}
                                    teacher={lesson.teacher}
                                    topic={lessonDetails?.topic}
                                    materials={lessonDetails?.materials}
                                    grade={grade}

                                    onClick={() => onLessonClick && onLessonClick(lesson, homework, dateString, 'home')}
                                />
                            );
                        })
                    )
                }
            </div>

            <div className="dashboard-widgets">
                <DeadlinesWidget
                    onNavigateToLesson={onNavigateToLesson}
                    onAssignmentsClick={onAssignmentsClick}
                />
                <RecentGradesWidget
                    onGradesClick={onGradesClick}
                    onNavigateToLesson={onNavigateToLesson}
                />
            </div>

            {/* Стрічка новин */}
            <div className="news-section">
                <h3 className="news-title">Стрічка новин</h3>

                <div className="news-list">
                    {newsData.map(news => (
                        <div key={news.id} className="news-item">
                            <div className="news-header-row">
                                <span className="news-item-title">{news.title}</span>
                                <span className="news-item-date">{news.date}</span>
                            </div>
                            <p className="news-item-text">{news.text}</p>
                            <div className="news-item-author">
                                <span className="material-symbols-outlined">person</span>
                                {news.author}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
function App() {
    const [activeTab, setActiveTab] = useState('home');
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [previousContext, setPreviousContext] = useState(null);
    const [diaryDate, setDiaryDate] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [teacherActiveTab, setTeacherActiveTab] = useState('journal');
    const [lessonToEdit, setLessonToEdit] = useState(null);

    const handleLogout = () => {
        setUserRole(null);
        setActiveTab('home');
        setTeacherActiveTab('journal');
        setSelectedLesson(null);
        setSelectedSubject(null);
        setLessonToEdit(null);
    };
    if (!userRole) {
        return <LoginPage onLogin={(role) => setUserRole(role)} />;
    }

    const getHeaderTitle = () => {
        // === ЛОГІКА ВЧИТЕЛЯ ===
        if (userRole === 'teacher') {
            if (lessonToEdit) {
                return "Редактор Уроку";
            }
            switch(teacherActiveTab) {
                case 'journal': return 'Журнал';
                case 'lessons': return 'Мої Уроки';
                case 'notify': return 'Сповіщення';
                case 'assignments': return 'Завдання';
                default: return 'Кабінет Вчителя';
            }
        }

        // === ЛОГІКА УЧНЯ ===
        if (selectedSubject) return selectedSubject.subject;
        if (selectedLesson) return selectedLesson.subject;

        switch(activeTab) {
            case 'home': return 'Головна';
            case 'diary': return 'Щоденник';
            case 'grades': return 'Успішність';
            default: return 'Головна';
        }
    };

    // Обробник кліка на урок
    const handleLessonClick = (lesson, homework, date, source) => {
        console.log('Клік на урок:', lesson, homework, date, 'з:', source);

        // Зберігаємо контекст звідки відкрили урок
        setPreviousContext({
            source: source,
            date: date,
            tab: activeTab
        });

        setSelectedLesson({ ...lesson, homework, date });
    };

    // Обробник повернення назад
    const handleBackFromLesson = () => {
        if (previousContext) {
            // Якщо відкрили з головної - повертаємось на головну
            if (previousContext.source === 'home') {
                setActiveTab('home');
                setDiaryDate(null);
            }
            if (previousContext.source === 'assignments') {
                setActiveTab('assignments');
            }
            // Якщо відкрили зі щоденника - повертаємось в щоденник на ту саму дату
            else if (previousContext.source === 'diary') {
                setActiveTab('diary');
                // Встановлюємо дату з якої відкрили урок
                setDiaryDate(new Date(previousContext.date));
            }
        }

        setSelectedLesson(null);
        setPreviousContext(null);
    };

    const handleSubjectClick = (subjectData) => {
        console.log('Клік на предмет:', subjectData);
        setSelectedSubject(subjectData);
        setSelectedLesson(null);
    };

    const handleBackFromSubject = () => {
        setSelectedSubject(null);
        setActiveTab('grades');
    };

    const handleGradesClick = () => {
        setActiveTab('grades');
        setSelectedLesson(null);
        setSelectedSubject(null);
        setPreviousContext(null);
        setDiaryDate(null);
    };

    const handleAssignmentClick = () => {
        setActiveTab('assignments');
        setSelectedLesson(null);
        setSelectedSubject(null);
        setPreviousContext(null);
        setDiaryDate(null);
    }

    const handleNavigateToSubject = (subject) => {
        const allSubjects = getAllGrades();
        const subjectData = allSubjects.find(s => s.subject === subject);

        if (subjectData) {
            setSelectedSubject(subjectData);
            setSelectedLesson(null);
            setActiveTab('grades');
        } else {
            alert("оцінок з цього предмету нема");
        }
    };

    // Обробник для редагування уроку вчителем
    const handleLessonEdit = (lesson, dateString) => {
        // Знаходимо всю інфу про урок, перш ніж відкрити редактор
        const materials = getMaterialsForLesson(lesson.id, dateString);
        const homework = getHomeworkForLesson(lesson.id, dateString);

        setLessonToEdit({
            lesson: lesson,
            dateString: dateString,
            materials: materials,
            homework: homework
        });
    };

    const handleCloseLessonEditor = () => {
        setLessonToEdit(null);
        setTeacherActiveTab('lessons'); // Повертаємось на список уроків
    };

    const navigateToLesson = (lessonId, dateString, source) => {
        console.log(`Навігація до уроку: ${lessonId} на ${dateString} з ${source}`);

        const lessonDate = new Date(dateString);
        const schedule = getScheduleForDate(lessonDate);

        const lesson = schedule.find(l => l.id === lessonId);

        if (!lesson) {
            console.error("Помилка: Урок не знайдено!");
            alert("Помилка: не вдалося знайти цей урок.");
            return;
        }

        const homework = getHomeworkForLesson(lessonId, dateString);

        // Використовуємо наш існуючий обробник
        handleLessonClick(lesson, homework, dateString, source);
    };

    const renderContent = () => {
        // === ЛОГІКА ВЧИТЕЛЯ ===
        if (userRole === 'teacher') {
            if (lessonToEdit) {
                return (
                    <TeacherLessonEditorPage
                        lessonData={lessonToEdit}
                        onBack={handleCloseLessonEditor}
                    />
                );
            }
            switch(teacherActiveTab) {
                case 'journal':
                    return <TeacherJournalPage />;
                case 'lessons':
                    return <TeacherLessonsPage onLessonSelect={handleLessonEdit} />;
                case 'notify':
                    return <TeacherNotificationsPage />;
                default:
                    return <TeacherJournalPage />;
            }
        }

        // === ЛОГІКА УЧНЯ ===
        if (selectedSubject) {
            return (
                <SubjectDetailPage
                    subjectData={selectedSubject}
                    onBack={handleBackFromSubject}
                />
            );
        }

        if (selectedLesson) {
            return (
                <LessonDetailPage
                    lesson={selectedLesson}
                    homework={selectedLesson.homework}
                    date={selectedLesson.date}
                    onNavigateToSubject={handleNavigateToSubject}
                    onBack={handleBackFromLesson}
                />
            );
        }

        // 3. Інакше показуємо звичайні сторінки
        switch(activeTab) {
            case 'home':
                return <HomePage
                    onLessonClick={handleLessonClick}
                    onGradesClick={handleGradesClick}
                    onNavigateToLesson={navigateToLesson}
                    onAssignmentsClick={handleAssignmentClick}
                />;
            case 'diary':
                return <DiaryPage onLessonClick={handleLessonClick} initialDate={diaryDate} />;
            case 'grades':
                return <GradesPage onSubjectClick={handleSubjectClick} />;
            case 'assignments':
                return <HomeworkPage onNavigateToLesson={navigateToLesson} />;
            default:
                return <HomePage onLessonClick={handleLessonClick} />;
        }
    };

    return (
        <div className="app">
            <header className="header">
                <HeaderContent title={getHeaderTitle()} onLogout={handleLogout} />
            </header>

            <main className="main-content">
                {renderContent()}
            </main>
            {userRole === 'student' && (
            <nav className="bottom-nav">
                <HeaderContent title={getHeaderTitle()} onLogout={handleLogout} />
                <div className="nav-content">
                    <button
                        onClick={() => {
                            setActiveTab('home');
                            setSelectedLesson(null);
                            setSelectedSubject(null);
                            setPreviousContext(null);
                            setDiaryDate(null);
                        }}
                        className={`nav-button ${activeTab === 'home' && !selectedLesson && !selectedSubject ? 'active' : ''}`}
                    >
                        <div className={"button-icon-wrapper"}>
                            <span className="material-symbols-outlined nav-icon">home</span>
                        </div>
                        <span>Головна</span>
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab('diary');
                            setSelectedLesson(null);
                            setPreviousContext(null);
                            setSelectedSubject(null);
                            setDiaryDate(null);
                        }}
                        className={`nav-button ${activeTab === 'diary' && !selectedLesson && !selectedSubject ? 'active' : ''}`}
                    >
                        <div className={"button-icon-wrapper"}>
                            <span className="material-symbols-outlined nav-icon">today</span>
                        </div>
                        <span>Щоденник</span>
                    </button>

                    <button
                        onClick={handleGradesClick}
                        className={`nav-button ${activeTab === 'grades' && !selectedLesson&& !selectedSubject ? 'active' : ''}`}
                    >
                        <div className={"button-icon-wrapper"}>
                            <span className="material-symbols-outlined nav-icon">award_star</span>
                        </div>
                        <span>Успішність</span>
                    </button>

                    <button
                        onClick={handleAssignmentClick}
                        className={`nav-button ${activeTab === 'assignments' && !selectedLesson && !selectedSubject ? 'active' : ''}`}
                    >
                        <div className={"button-icon-wrapper"}>
                            <span className="material-symbols-outlined nav-icon">assignment</span>
                        </div>
                        <span>Завдання</span>
                    </button>
                </div>
            </nav>
            )}

            {userRole === 'teacher' && (
                <nav className="bottom-nav">
                    <HeaderContent title={getHeaderTitle()} onLogout={handleLogout} />
                    <div className="nav-content">
                        <button
                            onClick={() => {
                                    setTeacherActiveTab('journal');
                                    setLessonToEdit(null);
                                }
                            }
                            className={`nav-button ${teacherActiveTab === 'journal' ? 'active' : ''}`}
                        >
                            <div className={"button-icon-wrapper"}>
                                <span className="material-symbols-outlined nav-icon">book</span>
                            </div>
                            <span>Журнал</span>
                        </button>

                        <button
                            onClick={() => {setTeacherActiveTab('lessons'); setLessonToEdit(null);}}
                            className={`nav-button ${teacherActiveTab === 'lessons' ? 'active' : ''}`}
                        >
                            <div className={"button-icon-wrapper"}>
                                <span className="material-symbols-outlined nav-icon">edit_calendar</span>
                            </div>
                            <span>Мої Уроки</span>
                        </button>

                        <button
                            onClick={() => {setTeacherActiveTab('notify'); setLessonToEdit(null);}}
                            className={`nav-button ${teacherActiveTab === 'notify' ? 'active' : ''}`}
                        >
                            <div className={"button-icon-wrapper"}>
                                <span className="material-symbols-outlined nav-icon">campaign</span>
                            </div>
                            <span>Сповіщення</span>
                        </button>
                    </div>
                </nav>
            )}
        </div>
    );
}

export default App;