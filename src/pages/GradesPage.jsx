// src/pages/GradesPage.jsx
import React, { useState, useMemo } from 'react';
import { getAllGrades, calculateAverage } from '../data/gradesData';
import SubjectCard from '../components/SubjectCard';
import './GradesPage.css';

function GradesPage({ onSubjectClick }) {
    const [semester, setSemester] = useState(1); // 1 або 2

    // Отримуємо та мемоізуємо дані
    const subjectsData = useMemo(() => getAllGrades(), []);

    // Розраховуємо загальний середній бал
    const totalAverage = useMemo(() => {
        const allAverages = subjectsData.map(s => s.average).filter(avg => avg > 0);
        return calculateAverage(allAverages.map(avg => ({ grade: avg })));
    }, [subjectsData]);

    const totalAbsences = useMemo(() => {
        return subjectsData.reduce((acc, s) => acc + (s.absenceCount || 0), 0);
    }, [subjectsData]);

    return (
        <div className="grades-page">
            {/* Селектор семестру */}
            <div className="semester-selector">
                <button
                    className={`semester-btn ${semester === 1 ? 'active' : ''}`}
                    onClick={() => setSemester(1)}
                >
                    I Семестр
                </button>
                <button
                    className={`semester-btn ${semester === 2 ? 'active' : ''}`}
                    onClick={() => setSemester(2)}
                >
                    II Семестр
                </button>
                <button
                    className={`semester-btn ${semester === 0 ? 'active' : ''}`}
                    onClick={() => setSemester(0)}
                >
                    Річна
                </button>
            </div>

            {/* Загальна статистика */}
            <div className="overall-stats-card">
                <div className="stats-item">
                    <span className="stats-label">Загальний середній бал</span>
                    <span className="stats-value">{totalAverage}</span>
                </div>

                <div className="stats-item">
                    <span className="stats-label">Пропусків (Н)</span>
                    <span className="stats-value">{totalAbsences}</span>
                </div>
            </div>

            {/* Список предметів */}
            <div className="subjects-grid">
                {subjectsData.map(subject => (
                    <SubjectCard
                        key={subject.subject}
                        subject={subject.subject}
                        teacher={subject.teacher}
                        average={subject.average}
                        grades={subject.semester1}
                        onClick={() => onSubjectClick(subject)}
                    />
                ))}
            </div>
        </div>
    );
}

export default GradesPage;