// src/pages/SubjectDetailPage.jsx
import React, {useState} from 'react';
import { calculateAverage } from '../data/gradesData';
import './SubjectDetailPage.css';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

// Утиліта для дати (YYYY-MM-DD -> DD.MM.YYYY)
const formatFullDate = (dateString) => {
    try {
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`;
    } catch (e) {
        return dateString;
    }
};

function SubjectDetailPage({ subjectData, onBack }) {

    const average = calculateAverage(subjectData.semester1);
    const absenceCount = subjectData.semester1_absences ? subjectData.semester1_absences.length : 0;
    const absences = subjectData.semester1_absences || [];

    const chartData = [...subjectData.semester1]
        .filter(g => typeof g.grade === 'number')
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(g => ({
            date: formatFullDate(g.date).slice(0, 5), // "03.11"
            grade: g.grade,
            type: g.type
        }));

    const [targetGrade, setTargetGrade] = useState("");
    const [calcResult, setCalcResult] = useState(null);

    const calculateNeededGrades = (grade, target, currentSum, gradeCount) => {
        const approxTarget = target-0.4;
        return Math.ceil((currentSum-approxTarget*gradeCount)/(approxTarget-grade))
    }

    const displayNeededGrades = () => {
        const target = parseFloat(targetGrade);
        if (!target || target > 12 || target < 1) {
            setCalcResult("Введіть реальну оцінку (1-12)");
            return;
        }

        if (target <= average) {
            setCalcResult("У вас вже є цей бал (або вищий)! 🎉");
            return;
        }
        console.log(subjectData)
        const gradesSum = subjectData.semester1.reduce((acc, grade) => acc + grade.grade, 0);
        const gradeCount = subjectData.semester1.length;
        const needed12 = calculateNeededGrades(12, target, gradesSum, gradeCount);

        let calcResult = "";
        for (let i = 12; i >= target; i--) {
            console.log(i);
            calcResult += String(calculateNeededGrades(i, target, gradesSum, gradeCount)) + " оцінок \"" + String(i) + "\"";
            if (i !== target) {
                calcResult += " АБО ";
            }
        }

        if (needed12 > 50 || needed12 < 0) {
            setCalcResult("На жаль, це математично майже неможливо в цьому семестрі 😢");
        } else {
            setCalcResult(`Щоб мати ${target}, треба отримати приблизно: `+calcResult+".");
        }
    };

    return (
        <div className="subject-detail-page">
            {/* Header */}
            <div className="detail-header subject-detail-header">
                <button onClick={onBack} className="back-button">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Назад
                </button>

                <div className="detail-header-info">
                    <h1 className="detail-subject">{subjectData.subject}</h1>
                    <div className="detail-meta">
                        <span className="material-symbols-outlined">person</span>
                        <span>{subjectData.teacher}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="detail-content">

                {/* Статистика */}
                <section className="detail-section">
                    <h2 className="section-title">
                        <span className="material-symbols-outlined">monitoring</span>
                        I Семестр
                    </h2>
                    <div className="subject-stats-grid">
                        <div className="subject-stats-item">
                            <span className="stats-label">Середній бал</span>
                            <span className="stats-value-small">{average}</span>
                        </div>
                        <div className="subject-stats-item">
                            <span className="stats-label">Пропусків</span>
                            <span className="stats-value-small">{absenceCount}</span>
                        </div>
                        <div className="subject-stats-item">
                            <span className="stats-label">Тематична</span>
                            <span className="stats-value-small">?</span>
                        </div>
                        <div className="subject-stats-item">
                            <span className="stats-label">Семестрова</span>
                            <span className="stats-value-small">{subjectData.semester1_final || '?'}</span>
                        </div>
                    </div>
                </section>

                {/* Графік успішності */}
                <section className="detail-section">
                    <h2 className="section-title">
                        <span className="material-symbols-outlined">show_chart</span>
                        Динаміка успішності
                    </h2>

                    <div style={{ width: '100%', height: 200 }}>
                        {chartData.length > 1 ? (
                            <ResponsiveContainer>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                                    <XAxis
                                        dataKey="date"
                                        tick={{fontSize: 12, fill: '#666'}}
                                        axisLine={false}
                                        tickLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        domain={[1, 12]}
                                        hide={true} // Ховаємо вісь Y для чистоти
                                    />
                                    <Tooltip
                                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}
                                        itemStyle={{color: '#6750A4', fontWeight: 600}}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="grade"
                                        stroke="#6750A4"
                                        strokeWidth={3}
                                        dot={{fill: '#6750A4', r: 4, strokeWidth: 0}}
                                        activeDot={{r: 6}}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="no-grades-message" style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                Недостатньо даних для графіка
                            </p>
                        )}
                    </div>
                </section>

                {/* Калькулятор оцінок */}
                <section className="detail-section">
                    <h2 className="section-title">
                        <span className="material-symbols-outlined">calculate</span>
                        Планування (Калькулятор)
                    </h2>
                    <div className="calculator-box">
                        <p className="calc-hint">Яку семестрову оцінку ти хочеш?</p>
                        <div className="calc-controls">
                            <input
                                type="number"
                                className="calc-input"
                                value={targetGrade}
                                onChange={(e) => setTargetGrade(e.target.value)}
                                placeholder="11"
                                max="12"
                                min="1"
                            />
                            <button className="calc-btn" onClick={displayNeededGrades}>
                                Розрахувати
                            </button>
                        </div>
                        {calcResult && (
                            <div className="calc-result">
                                <span className="material-symbols-outlined">lightbulb</span>
                                <p>{calcResult}</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Усі Оцінки */}
                <section className="detail-section">
                    <h2 className="section-title">
                        <span className="material-symbols-outlined">grade</span>
                        Список оцінок
                    </h2>

                    {subjectData.semester1.length > 0 ? (
                        <div className="full-grades-list">
                            {/* Відображаємо у зворотному порядку - новіші вгорі */}
                            {[...subjectData.semester1].reverse().map((grade) => (
                                <div key={grade.id} className="full-grade-item">
                                    <div className="full-grade-main">
                                        <div className="full-grade-value">{grade.grade}</div>
                                        <div className="full-grade-info">
                                            <span className="full-grade-type">{grade.type}</span>
                                            <span className="full-grade-date">{formatFullDate(grade.date)}</span>
                                        </div>
                                    </div>
                                    {grade.comment && (
                                        <div className="full-grade-comment">
                                            <span className="material-symbols-outlined">chat_bubble</span>
                                            <span>{grade.comment}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-grades-message">Оцінок за цей семестр ще немає.</p>
                    )}
                </section>

                <section className="detail-section">
                    <h2 className="section-title">
                        <span className="material-symbols-outlined">event_busy</span>
                        Список пропусків
                    </h2>

                    {absences.length > 0 ? (
                        <div className="full-absences-list">
                            {[...absences].reverse().map((absence) => (
                                <div key={absence.id} className="full-absence-item">
                                    <div className="full-absence-main">
                                        <div className="full-absence-icon">
                                            <span className="material-symbols-outlined">
                                                person_off
                                            </span>
                                        </div>
                                        <div className="full-absence-info">
                                            <span className="full-absence-type">
                                                Пропуск
                                            </span>
                                            <span className="full-absence-date">{formatFullDate(absence.date)}</span>
                                        </div>
                                    </div>
                                    {absence.comment && (
                                        <div className="full-absence-comment">
                                            <span className="material-symbols-outlined">chat_bubble</span>
                                            <span>{absence.comment}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-grades-message">Пропусків за цей семестр немає.</p>
                    )}
                </section>

            </div>
        </div>
    );
}

export default SubjectDetailPage;