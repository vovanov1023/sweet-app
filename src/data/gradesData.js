// src/data/gradesData.js

// Утиліта для розрахунку середнього
export const calculateAverage = (grades) => {
    if (!grades || grades.length === 0) return 0;
    const sum = grades.reduce((acc, grade) => acc + grade.grade, 0);
    const average = sum / grades.length;
    // Повертаємо середнє з одним знаком після коми
    return parseFloat(average.toFixed(1));
};

export const gradesData = {
    "algebra": {
        subject: "Алгебра",
        teacher: "Чистюк С.Д.",
        semester1: [
            { id: 1, type: "СР", grade: 11, max: 12, date: "2025-11-04", lessonId: "7" },
            { id: 3, type: "КР", grade: 9, max: 12, date: "2025-11-05", lessonId: "2" }
        ],
        semester1_absences: [
            { id: 'a1', date: '2025-09-18', },
            { id: 'a2', date: '2025-10-03', comment: 'Був у лікаря' }
        ],
        semester1_final: 10,
        semester2: [],
        semester2_final: null,
        year_final: null,
    },
    "ukrainian_language": {
        subject: "Українська мова",
        teacher: "Івахненко Г.М.",
        semester1: [
            { id: 6, type: "Диктант", grade: 8, max: 12, date: "2025-11-04", comment: "", lessonId: "5" }
        ],
        semester1_absences: [],
        semester1_final: 9,
        semester2: [],
        semester2_final: null,
        year_final: null,
    },
    "physics": {
        subject: "Фізика",
        teacher: "Коваленко О.А.",
        semester1: [
            { id: 9, type: "ЛР", grade: 11, max: 12, date: "2025-11-03", comment: "", lessonId: "5" }
        ],
        semester1_absences: [],
        semester1_final: 11,
        semester2: [],
        semester2_final: null,
        year_final: null,
    },
    "english_language": {
        subject: "Англійська мова",
        teacher: "Дорошенко Л.В.",
        semester1: [
            { id: 12, type: "Speaking", grade: 12, max: 12, date: "2025-11-03", comment: "", lessonId: "1"}
        ],
        semester1_absences: [],
        semester1_final: 11,
        semester2: [],
        semester2_final: null,
        year_final: null,
    },
    "ukraine_history": {
        subject: "Історія України",
        teacher: "Міщенко С.О.",
        semester1: [
            { id: 15, type: "Відповідь", grade: 9, max: 12, date: "2025-09-16", comment: "", lessonId: "7" }
        ],
        semester1_absences: [],
        semester1_final: 9,
        semester2: [],
        semester2_final: null,
        year_final: null,
    }
};

export function getGradesForLesson(subjectName) {
    for (const subject in gradesData) {
        if (gradesData[subject].subject === subjectName) {
            return gradesData[subject].semester1;
        }
    }
    return [];
}

// Отримати всі дані
export const getAllGrades = () => {
    // Одразу розраховуємо середній бал для кожного предмету
    const subjects = Object.values(gradesData);
    return subjects.map(
        subject => (
            {
                ...subject,
                average: calculateAverage(subject.semester1), // Поки що рахуємо лише за 1 семестр
                absenceCount: subject.semester1_absences ? subject.semester1_absences.length : 0
            }
        )
    );
};

export const getGradeForLesson = (subjectName, dateString, lessonId) => {
    const grades = getGradesForLesson(subjectName);
    if (!grades) return null;
    return grades.find(grade => grade.date === dateString && grade.lessonId === lessonId) || null;
};

export const getRecentGrades = (limit = 3) => {
    const allGrades = [];

    for (const subjectKey in gradesData) {
        const subject = gradesData[subjectKey];

        subject.semester1.forEach(grade => {
            allGrades.push({
                ...grade,
                subject: subject.subject
            });
        });
    }

    allGrades.sort((a, b) => new Date(b.date) - new Date(a.date));
    return allGrades.slice(0, limit);
};

export const syncGradeFromJournal = (subjectId, date, value, comment = "") => {
    const subjectData = gradesData[subjectId];
    if (!subjectData) return;

    const isAbsence = ["н", "Н"].includes(value);
    const isEmpty = value.trim() === "";

    // 1. Спочатку шукаємо, чи вже є оцінка/пропуск за цю дату
    const existingGradeIndex = subjectData.semester1.findIndex(g => g.date === date);
    const existingAbsenceIndex = subjectData.semester1_absences.findIndex(a => a.date === date);

    // Логіка ВИДАЛЕННЯ (якщо вчитель стер оцінку)
    if (isEmpty) {
        if (existingGradeIndex !== -1) subjectData.semester1.splice(existingGradeIndex, 1);
        if (existingAbsenceIndex !== -1) subjectData.semester1_absences.splice(existingAbsenceIndex, 1);
        console.log(`Запис за ${date} видалено.`);
        return;
    }

    // Логіка ДЛЯ ПРОПУСКІВ
    if (isAbsence) {
        // Якщо була звичайна оцінка - видаляємо її
        if (existingGradeIndex !== -1) subjectData.semester1.splice(existingGradeIndex, 1);

        // Оновлюємо або додаємо пропуск
        if (existingAbsenceIndex !== -1) {
            subjectData.semester1_absences[existingAbsenceIndex].type = value.toUpperCase();
        } else {
            subjectData.semester1_absences.push({
                id: Date.now(),
                date: date,
                type: value.toUpperCase(),
                comment: comment
            });
        }
        console.log(`Пропуск синхронізовано: ${value}`);
    }
    // Логіка ДЛЯ ОЦІНОК (числа)
    else {
        // Якщо був пропуск - видаляємо його
        if (existingAbsenceIndex !== -1) subjectData.semester1_absences.splice(existingAbsenceIndex, 1);

        const numValue = parseInt(value);
        if (isNaN(numValue)) return; // Захист від NaN

        if (existingGradeIndex !== -1) {
            // Оновлюємо існуючу
            subjectData.semester1[existingGradeIndex].grade = numValue;
        } else {
            // Створюємо нову
            subjectData.semester1.push({
                id: Date.now(),
                type: "Поточна",
                grade: numValue,
                max: 12,
                date: date,
                lessonId: "temp",
                comment: comment
            });
        }
        console.log(`Оцінка синхронізована: ${numValue}`);
    }
};