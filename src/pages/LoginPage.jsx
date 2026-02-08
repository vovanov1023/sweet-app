import React from 'react';
import './LoginPage.css';

function LoginPage({ onLogin }) {
    return (
        <div className="login-page">
            <div className="login-logo">
                <span className="material-symbols-outlined" style={{fontSize: '64px'}}>school</span>
            </div>

            <h1 className="login-title">Sweet</h1>
            <p className="login-subtitle">Оберіть роль для входу в систему</p>

            <div className="login-roles-container">
                {/* Картка Учня */}
                <button className="role-card" onClick={() => onLogin('student')}>
                    <div className="role-icon">
                        <span className="material-symbols-outlined">backpack</span>
                    </div>
                    <span className="role-title">Я Учень</span>
                    <span className="role-desc">Розклад, оцінки та домашні завдання</span>
                </button>

                {/* Картка Вчителя */}
                <button className="role-card" onClick={() => onLogin('teacher')}>
                    <div className="role-icon">
                        <span className="material-symbols-outlined">edit_note</span>
                    </div>
                    <span className="role-title">Я Вчитель</span>
                    <span className="role-desc">Журнал, планування та оголошення</span>
                </button>
            </div>
        </div>
    );
}

export default LoginPage;