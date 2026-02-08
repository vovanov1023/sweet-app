// src/pages/LessonDetailPage.jsx
import React, { useState } from 'react';
import './LessonDetailPage.css';
import {getMaterialsForLesson, getCommentsForLesson} from '../data/lessonMaterials';
import {getGradeForLesson} from "../data/gradesData";

function LessonDetailPage({ lesson, homework, date, onBack, onNavigateToSubject }) {
    const [homeworkText, setHomeworkText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newComment, setNewComment] = useState('');

    const materials = getMaterialsForLesson(lesson.id, date);
    const comments = getCommentsForLesson(lesson.id, date);
    const grade = getGradeForLesson(lesson.subject, date, lesson.id);

    // Іконки для типів матеріалів
    const getIconForType = (type) => {
        const icons = {
            link: 'link',
            file: 'description',
            video: 'play_circle',
            slideshow: 'slideshow',
            article: 'article'
        };
        return icons[type] || 'attach_file';
    };

    const handleSubmitHomework = () => {
        if (!homeworkText.trim()) return;
        setIsSubmitting(true);

        // Імітація відправки
        setTimeout(() => {
            alert('Домашнє завдання здано! ✅');
            setHomeworkText('');
            setIsSubmitting(false);
        }, 1000);
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        alert('Коментар додано! (поки що тільки імітація)');
        setNewComment('');
    };

    return (
        <div className="lesson-detail-page">
            {/* Header */}
            <div className="detail-header">
                <button onClick={onBack} className="back-button">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Назад
                </button>

                <div className="detail-header-info">
                    <h1 className="detail-subject">{lesson.subject}</h1>
                    <div className="detail-meta">
                        <span className="material-symbols-outlined">schedule</span>
                        <span>{lesson.time}</span>
                        {lesson.room && (
                            <>
                                <span className="material-symbols-outlined">door_front</span>
                                <span>{lesson.room}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="detail-content">

                {/* Інформація про урок */}
                {materials && (
                    <section className="detail-section">
                        <h2 className="section-title">
                            <span className="material-symbols-outlined">school</span>
                            Тема уроку
                        </h2>
                        <div className="info-card">
                            <h3 className="lesson-topic">{materials.topic}</h3>
                            <p className="lesson-description">{materials.description}</p>
                        </div>
                    </section>
                )}

                {/* Матеріали до уроку */}
                {materials && materials.materials.length > 0 && (
                    <section className="detail-section">
                        <h2 className="section-title">
                            <span className="material-symbols-outlined">folder_open</span>
                            Матеріали до уроку
                        </h2>
                        <div className="materials-list">
                            {materials.materials.map((material) => (
                                <a
                                    key={material.id}
                                    href={material.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="material-item"
                                >
                                    <span className="material-symbols-outlined material-icon">
                                      {material.icon || getIconForType(material.type)}
                                    </span>
                                    <span className="material-title">{material.title}</span>
                                    <span className="material-symbols-outlined">open_in_new</span>
                                </a>
                            ))}
                        </div>
                    </section>
                )}

                {/* Домашнє завдання */}
                {homework && (
                    <section className="detail-section homework-section">
                        <h2 className="section-title">
                            <span className="material-symbols-outlined">assignment</span>
                            Домашнє завдання
                        </h2>

                        <div className="homework-card">
                            <div className="homework-header-detail">
                                <h3 className="homework-title-detail">{homework.title}</h3>
                                <div className={`homework-status ${homework.completed ? 'completed' : 'pending'}`}>
                                    <span className="material-symbols-outlined">
                                      {homework.completed ? 'check_circle' : 'pending'}
                                    </span>
                                    <span>{homework.completed ? 'Здано' : 'Не здано'}</span>
                                </div>
                            </div>

                            <p className="homework-description-detail">{homework.description}</p>

                            <div className="homework-deadline-detail">
                                <span className="material-symbols-outlined">schedule</span>
                                <span>Здати до: {homework.deadline}</span>
                            </div>

                            {/* Форма здачі */}
                            {!homework.completed && (
                                <div className="homework-submit">
                                    <label className="submit-label">Ваша відповідь:</label>
                                    <textarea
                                        className="submit-textarea"
                                        placeholder="Напишіть вашу відповідь або опишіть виконану роботу..."
                                        value={homeworkText}
                                        onChange={(e) => setHomeworkText(e.target.value)}
                                        rows={4}
                                    />
                                    <div className="submit-actions">
                                        <button className="attach-file-btn">
                                            <span className="material-symbols-outlined">attach_file</span>
                                            Прикріпити файл
                                        </button>
                                        <button
                                            className="submit-btn"
                                            onClick={handleSubmitHomework}
                                            disabled={isSubmitting || !homeworkText.trim()}
                                        >
                                            {isSubmitting ? 'Відправка...' : 'Здати завдання'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Оцінка */}
                 { grade != null && (
                    <section className="detail-section">
                        <h2 className="section-title">
                            <span className="material-symbols-outlined">grade</span>
                            Оцінка
                        </h2>
                        <button className={"see-all-grades-btn"} onClick={() => onNavigateToSubject(lesson.subject)}>Всі оцінки</button>
                        <div className="grades-list">
                            {
                                <div key={grade.id} className="grade-item">
                                    <div className="grade-info">
                                        <div className="grade-type">{grade.type}</div>
                                        <div className="grade-date">
                                            {new Date(grade.date).toLocaleDateString('uk-UA')}
                                        </div>
                                    </div>
                                    <div className="grade-value-large">
                                        {grade.grade}/{grade.max}
                                    </div>
                                    {grade.comment && (
                                        <div className="grade-comment">
                                            <span className="material-symbols-outlined">comment</span>
                                            <span>{grade.comment}</span>
                                        </div>
                                    )}
                                </div>
                            }
                        </div>
                    </section>
                 )
                }

                {/* Коментарі */}
                <section className="detail-section">
                    <h2 className="section-title">
                        <span className="material-symbols-outlined">forum</span>
                        Коментарі
                    </h2>

                    {/* Форма нового коментаря */}
                    <div className="comment-form">
            <textarea
                className="comment-textarea"
                placeholder="Напишіть коментар або запитання..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
            />
                        <button
                            className="comment-submit-btn"
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                        >
                            Відправити
                        </button>
                    </div>

                    {/* Список коментарів */}
                    {comments.length > 0 ? (
                        <div className="comments-list">
                            {comments.map((comment) => (
                                <div key={comment.id} className="comment-item">
                                    <div className="comment-avatar">
                                        <span className="material-symbols-outlined">account_circle</span>
                                    </div>
                                    <div className="comment-content">
                                        <div className="comment-header">
                                            <span className="comment-author">{comment.author}</span>
                                            <span className={`comment-role ${comment.role}`}>
                        {comment.role === 'teacher' ? 'Вчитель' : 'Учень'}
                      </span>
                                            <span className="comment-date">
                        {new Date(comment.date).toLocaleDateString('uk-UA')}
                      </span>
                                        </div>
                                        <p className="comment-text">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-comments">
                            <span className="material-symbols-outlined">chat_bubble_outline</span>
                            <p>Коментарів поки немає. Будьте першим!</p>
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}

export default LessonDetailPage;