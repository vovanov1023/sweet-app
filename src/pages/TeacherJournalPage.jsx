// src/pages/TeacherJournalPage.js
import React, { useState, useEffect } from 'react';
import { getStudentsByClass } from '../data/classData';
import { getJournalData, getLessonDatesForSubject, updateJournalEntry, updateLessonType } from '../data/teacherJournalData';
import { syncGradeFromJournal } from '../data/gradesData';
import { generateStudentReport } from "../utils/studentAnalysis";
import './TeacherJournalPage.css';
import ReportModal from "../components/ReportModal";
import JournalPopover from "../components/JournalPopover"; // Імпортуємо новий компонент

const formatJournalDate = (dateString) => {
    try {
        const parts = dateString.split('-');
        return `${parts[2]}.${parts[1]}`;
    } catch (e) { return dateString; }
};

function TeacherJournalPage() {
    const [selectedClass, setSelectedClass] = useState('10a');
    const [selectedSubject, setSelectedSubject] = useState('algebra');

    // Стан для модалки звітів (велика)
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [reportText, setReportText] = useState("");
    const [reportStudent, setReportStudent] = useState("");

    const [journalData, setJournalData] = useState({});
    const [datesColumns, setDatesColumns] = useState([]);

    // === НОВИЙ СТАН: Поповер (маленька модалка) ===
    const [popoverState, setPopoverState] = useState({
        isOpen: false,
        type: null, // 'header' або 'grade'
        position: { x: 0, y: 0 },
        data: null, // дані про клітинку (studentId, date) або заголовок (date)
        tempComment: ""
    });

    const students = getStudentsByClass(selectedClass);

    useEffect(() => {
        const data = getJournalData(selectedSubject, selectedClass);
        setJournalData(JSON.parse(JSON.stringify(data)));
        setDatesColumns(getLessonDatesForSubject(selectedSubject, selectedClass));
    }, [selectedClass, selectedSubject]);

    // --- Логіка звітів ---
    const handleOpenReport = (student) => {
        const studentGrades = journalData[student.id];
        const text = generateStudentReport(student.name, studentGrades);
        setReportText(text);
        setReportStudent(student.name);
        setIsReportOpen(true);
    };

    // --- Відкриття поповера для ЗАГОЛОВКА ---
    const handleHeaderClick = (e, date) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPopoverState({
            isOpen: true,
            type: 'header',
            position: { x: rect.left, y: rect.bottom + 5 }, // Трохи нижче заголовка
            data: { date },
            tempComment: ""
        });
    };

    // --- Відкриття поповера для ОЦІНКИ ---
    const handleCellClick = (e, studentId, date) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPopoverState({
            isOpen: true,
            type: 'grade',
            position: { x: rect.left, y: rect.bottom + 5 },
            data: { studentId, date }
        });
    };

    // --- Вибір ТИПУ уроку ---
    const handleSelectType = (newType) => {
        const { date } = popoverState.data;

        updateLessonType(selectedSubject, selectedClass, date, newType);

        setDatesColumns(prev => prev.map(col =>
            col.date === date ? { ...col, type: newType } : col
        ));

        setPopoverState({ ...popoverState, isOpen: false });
    };

    // --- Вибір ОЦІНКИ ---
    const handleSelectGrade = (value) => {
        const { studentId, date } = popoverState.data;
        const comment = popoverState.tempComment;

        // 1. Оновлюємо UI
        setJournalData(prevData => {
            const newData = { ...prevData };
            if (!newData[studentId]) newData[studentId] = {};

            if (value === "") delete newData[studentId][date];
            else newData[studentId][date] = value;

            return newData;
        });

        // 2. Зберігаємо в базу
        updateJournalEntry(selectedSubject, selectedClass, studentId, date, value);

        // 3. Синхронізуємо (для демо)
        if (studentId === 's10') {
            syncGradeFromJournal(selectedSubject, date, value, comment);
        }

        setPopoverState({ ...popoverState, isOpen: false });
    };

    const getHeaderClass = (type) => {
        switch(type) {
            case "КР": return "header-kr";
            case "СР": return "header-sr";
            case "Тема": return "header-theme";
            case "ПЗ": return "header-pz";
            default: return "";
        }
    };

    const getGradeValue = (studentId, date) => {
        if (journalData[studentId] && journalData[studentId][date] !== undefined) {
            return journalData[studentId][date];
        }
        return "";
    };

    return (
        <div className="journal-page">
            <div className="journal-selectors">
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="journal-select">
                    <option value="10a">10-А Клас</option>
                </select>
                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="journal-select">
                    <option value="algebra">Алгебра</option>
                    <option value="ukrainian_language">Укр. мова</option>
                </select>
            </div>

            <div className="journal-table-wrapper">
                <table className="journal-table">
                    <thead>
                    <tr>
                        <th className="student-name-header">Учень</th>
                        {datesColumns.map(lesson => (
                            <th
                                key={lesson.date}
                                className={`date-header clickable ${getHeaderClass(lesson.type)}`}
                                onClick={(e) => handleHeaderClick(e, lesson.date)}
                            >
                                <div className="date-cell">
                                    <span>{formatJournalDate(lesson.date)}</span>
                                    <span className="date-type">{lesson.type}</span>
                                </div>
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody>
                    {students.map((student, index) => (
                        <tr key={student.id}>
                            <td className="student-name-cell">
                                <div className="contents">
                                    <span className="student-index">{index + 1}.</span>
                                        {student.name}
                                    <button className="report-btn" onClick={() => handleOpenReport(student)}>
                                        <span className="material-symbols-outlined">description</span>
                                    </button>
                                </div>
                            </td>

                            {datesColumns.map(lesson => {
                                const val = getGradeValue(student.id, lesson.date);
                                // Визначаємо колір тексту для відображення
                                let valClass = "";
                                if (["10","11","12"].includes(val)) valClass = "high";
                                else if (["7","8","9"].includes(val)) valClass = "medium";
                                else if (["4","5","6"].includes(val)) valClass = "low";
                                else if (["1","2","3","н","Н","Н/А"].includes(val)) valClass = "bad";

                                return (
                                    <td
                                        key={`${student.id}-${lesson.date}`}
                                        className="grade-cell clickable"
                                        onClick={(e) => handleCellClick(e, student.id, lesson.date)}
                                    >
                                        <div className={`grade-display ${valClass}`}>
                                            {val}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* === POPOVER === */}
            <JournalPopover
                isOpen={popoverState.isOpen}
                onClose={() => setPopoverState({...popoverState, isOpen: false})}
                position={popoverState.position}
                title={popoverState.type === 'header' ? 'Тип уроку' : 'Оцінка'}
            >
                {popoverState.type === 'header' && (
                    <div className="types-list">
                        {[
                            {l: "Урок", c: "#e5e7eb"},
                            {l: "СР", c: "#fef08a"},
                            {l: "КР", c: "#fecaca"},
                            {l: "Тема", c: "#e9d5ff"},
                            {l: "ПЗ", c: "#bfdbfe"}
                        ].map(t => (
                            <button
                                key={t.l}
                                className="type-option-btn"
                                onClick={() => handleSelectType(t.l)}
                            >
                                <span className="type-dot" style={{background: t.c}}></span>
                                {t.l}
                            </button>
                        ))}
                    </div>
                )}

                {popoverState.type === 'grade' && (
                    <div className={"popover-grade-content"}>
                        <div className="grades-grid">
                            {[1,2,3,4,5,6,7,8,9,10,11,12].reverse().map(g => (
                                <button key={g} className="grade-option-btn" onClick={() => handleSelectGrade(String(g))}>
                                    {g}
                                </button>
                            ))}
                            <button className="grade-option-btn special" onClick={() => handleSelectGrade("Н")}>Н</button>
                            <button className="grade-option-btn special" style={{fontSize: '11px'}} onClick={() => handleSelectGrade("Н/А")}>Н/А</button>
                            <button className="grade-option-btn" style={{color: '#666'}} onClick={() => handleSelectGrade("")}>❌</button>
                        </div>
                        <div className="popover-comment-section">
                            <input
                                type="text"
                                className="popover-comment-input"
                                placeholder="Коментар..."
                                value={popoverState.tempComment}
                                onChange={(e) => setPopoverState({...popoverState, tempComment: e.target.value})}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                )}
            </JournalPopover>

            <ReportModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
                text={reportText}
                studentName={reportStudent}
            />
        </div>
    );
}

export default TeacherJournalPage;