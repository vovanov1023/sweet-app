// src/data/teacherJournalData.js

const journalDatabase = {
    "algebra_10a": {
        "s1": { "2025-11-03": "10", "2025-11-05": "9", "2025-11-07": "11" },
        "s2": { "2025-11-03": "8", "2025-11-05": "н" },
        "s3": { "2025-11-03": "11", "2025-11-05": "12", "2025-11-07": "10" },
        // ... (інші учні)
        "s10": { "2025-11-03":"н", "2025-11-04": "11", "2025-11-05": "9" }
    }
};

// === НОВЕ: База даних типів уроків ===
// Ключ: "subject_class_date" -> Тип
const lessonTypesDB = {
    "algebra_10a_2025-11-07": "КР",
    "algebra_10a_2025-11-05": "СР"
};

// Отримати тип уроку
export const getLessonType = (subject, group, date) => {
    const key = `${subject}_${group}_${date}`;
    return lessonTypesDB[key] || "Урок"; // Дефолт
};

// Змінити тип уроку
export const updateLessonType = (subject, group, date, newType) => {
    const key = `${subject}_${group}_${date}`;
    lessonTypesDB[key] = newType;
    console.log(`Тип змінено: ${key} -> ${newType}`);
};

export const getLessonDatesForSubject = (subjectId, classId) => {
    // Статичний список дат для прототипу
    const dates = [
        "2025-11-03",
        "2025-11-04",
        "2025-11-05",
        "2025-11-07",
        "2025-11-10",
        "2025-11-12",
    ];

    // === ОНОВЛЕНО: Повертаємо об'єкти з типом ===
    return dates.map(date => ({
        date: date,
        type: getLessonType(subjectId, classId, date)
    }));
};

export const getJournalData = (subjectId, classId) => {
    const key = `${subjectId}_${classId}`;
    return journalDatabase[key] || {};
};

export const updateJournalEntry = (subjectId, classId, studentId, date, value) => {
    const key = `${subjectId}_${classId}`;

    if (!journalDatabase[key]) journalDatabase[key] = {};
    if (!journalDatabase[key][studentId]) journalDatabase[key][studentId] = {};

    if (value === "") {
        delete journalDatabase[key][studentId][date];
    } else {
        journalDatabase[key][studentId][date] = value;
    }
    console.log(`Журнал збережено: ${studentId} ${date} -> ${value}`);
};