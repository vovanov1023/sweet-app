// src/pages/TeacherNotificationsPage.jsx
import React, { useState } from 'react';
import { addNews } from '../data/newsData';
import './LessonDetailPage.css'; // Перевикористовуємо стилі (форми, кнопки)

function TeacherNotificationsPage() {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');

    const handlePublish = () => {
        if (!title.trim() || !text.trim()) return;

        addNews(title, text);

        alert('Оголошення опубліковано!');
        setTitle('');
        setText('');
    };

    return (
        <div className="teacher-notifications-page">
            <div className="page-title">
                <h2>Створити оголошення</h2>
            </div>

            <div className="detail-section">
                <div className="form-group">
                    <label>Заголовок</label>
                    <input
                        type="text"
                        className="form-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Важливе повідомлення..."
                    />
                </div>
                <div className="form-group">
                    <label>Текст оголошення</label>
                    <textarea
                        className="form-textarea"
                        rows="4"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Деталі..."
                    />
                </div>
                <button className="save-lesson-btn" onClick={handlePublish}>
                    <span className="material-symbols-outlined">send</span>
                    Опублікувати
                </button>
            </div>

            <p className="form-hint" style={{marginTop: '20px', textAlign: 'center'}}>
                Це оголошення з'явиться на головній сторінці всіх учнів класу.
            </p>
        </div>
    );
}

export default TeacherNotificationsPage;