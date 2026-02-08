// src/components/SubjectCard.jsx
import React from 'react';
import './SubjectCard.css';

// Проста утиліта для кольору на основі оцінки
const getGradeColor = (avg) => {
    if (avg >= 10) return 'grade-high'; // зелений
    if (avg >= 7) return 'grade-medium'; // жовтий
    if (avg >= 4) return 'grade-low'; // помаранчевий
    return 'grade-very-low'; // червоний
};

// Утиліта для дати (YYYY-MM-DD -> DD.MM)
const formatDate = (dateString) => {
    try {
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}`;
    } catch (e) {
        return dateString; // На випадок іншого формату
    }
};

function SubjectCard({ subject, teacher, average, grades, onClick }) {
    const colorClass = getGradeColor(average);

    return (
        <div className="subject-card" onClick={onClick}>
            <div className="subject-card-header">
                <div className="subject-card-info">
                    <h3 className="subject-card-title">{subject}</h3>
                    <span className="subject-card-teacher">{teacher}</span>
                </div>
                <div className={`subject-card-average ${colorClass}`}>
                    {average}
                </div>
            </div>

            <div className="subject-card-grades">
                <span className="grades-label">Останні оцінки:</span>
                <div className="grades-list">
                    {/* Беремо 5 останніх, перевертаємо, щоб новіші були вгорі */}
                    {grades.slice(-5).reverse().map((grade) => (
                        <div key={grade.id} className="grade-item-detailed">

                            <div className="grade-item-header">
                                <span className="grade-item-value">{grade.grade}</span>
                                <span className="grade-item-type">{grade.type}</span>
                                <span className="grade-item-date">{formatDate(grade.date)}</span>
                            </div>

                            {/* Відображаємо коментар, якщо він є */}
                            {grade.comment && (
                                <div className="grade-item-comment">
                                    <span className="material-symbols-outlined">comment</span>
                                    {/* Цей span потрібен для правильного скорочення тексту */}
                                    <span>{grade.comment}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SubjectCard;