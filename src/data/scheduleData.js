// src/data/scheduleData.js

export const bellSchedule = [
    { start: "08:50", end: "09:35" },
    { start: "09:40", end: "10:25" },
    { start: "10:35", end: "11:20" },
    { start: "11:25", end: "12:10" },
    { start: "12:30", end: "13:15" },
    { start: "13:30", end: "14:15" },
    { start: "14:25", end: "15:10" },
    { start: "15:15", end: "16:00" }
];

const baseSchedule = {
    monday: [
        { id: "1", subject: "Англійська мова", room: "107", teacher: "Дорошенко Л.В." },
        { id: "2", subject: "Англійська мова", room: "107", teacher: "Дорошенко Л.В." },
        { id: "3", subject: "Алгебра", room: "106", teacher: "Чистюк С.Д." },
        { id: "4", subject: "Алгебра", room: "106", teacher: "Чистюк С.Д." },
        { id: "5", subject: "Фізика", room: "102", teacher: "Коваленко О.А." },
        { id: "6", subject: "Фізика", room: "102", teacher: "Коваленко О.А." }
    ],
    tuesday: [
        { id: "1", subject: "Фізична культура", room: "Спортзал", teacher: "Мельник С.А." },
        { id: "2", subject: "Фізична культура", room: "Спортзал", teacher: "Мельник С.А." },
        { id: "3", subject: "Геометрія", room: "106", teacher: "Чистюк С.Д." },
        { id: "4", subject: "Геометрія", room: "106", teacher: "Чистюк С.Д." },
        { id: "5", subject: "Українська мова", room: "202", teacher: "Івахненко Г.М." },
        { id: "6", subject: "Українська мова", room: "202", teacher: "Івахненко Г.М." },
        { id: "7", subject: "Алгебра", room: "106", teacher: "Чистюк С.Д." },
        { id: "8", subject: "Алгебра", room: "106", teacher: "Чистюк С.Д." }
    ],
    wednesday: [
        { id: "1", subject: "Алгебра", room: "106", teacher: "Чистюк С.Д." },
        { id: "2", subject: "Алгебра", room: "106", teacher: "Чистюк С.Д." },
        { id: "3", subject: "Інформатика", room: "101", teacher: "Комаров І.Ю." },
        { id: "4", subject: "Технології", room: "101", teacher: "Комаров І.Ю." },
        { id: "5", subject: "Англійська мова", room: "202", teacher: "Дорошенко Л.В." },
        { id: "6", subject: "Англійська мова", room: "202", teacher: "Дорошенко Л.В." },
        { id: "7", subject: "Захист України", room: "204", teacher: "Семенов С.С." },
        { id: "8", subject: "Захист України", room: "204", teacher: "Семенов С.С." }
    ],
    thursday: [
        { id: "1", subject: "Хімія", room: null, teacher: "Малая Н.О." },
        { id: "2", subject: "Хімія", room: null, teacher: "Малая Н.О." },
        { id: "3", subject: "Географія", room: null, teacher: "Рибачик Н.О." },
        { id: "4", subject: "Географія", room: null, teacher: "Рибачик Н.О." },
        { id: "5", subject: "Всесвітня історія", room: null, teacher: "Нероденко В.В." },
        { id: "6", subject: "Всесвітня історія", room: null, teacher: "Нероденко В.В." },
        { id: "7", subject: "Біологія", room: null, teacher: "Корнова Н.О." },
        { id: "8", subject: "Біологія", room: null, teacher: "Корнова Н.О." },
    ],
    friday: [
        { id: "1", subject: "Геометрія", room: "104", teacher: "Чистюк С.Д." },
        { id: "2", subject: "Геометрія", room: "104", teacher: "Чистюк С.Д." },
        { id: "3", subject: "Українська література", room: "106", teacher: "Корнова В.М." },
        { id: "4", subject: "Українська література", room: "106", teacher: "Корнова В.М." },
        { id: "5", subject: "Алгебра", room: "106", teacher: "Чистюк С.Д." },
        { id: "6", subject: "Алгебра", room: "106", teacher: "Чистюк С.Д." },
        { id: "7", subject: "Історія України", room: "104", teacher: "Міщенко С.О." },
        { id: "8", subject: "Історія України", room: "104", teacher: "Міщенко С.О." }
    ]
};

// Отримання розкладу на конкретний день
export const getScheduleForDate = (date) => {
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return [];
    }

    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];

    const finalSchedule = baseSchedule[dayName];
    finalSchedule.forEach(lesson => {
        const schedule = bellSchedule[Number(lesson.id)-1]
        lesson.lessonNumber = lesson.id;
        lesson.time = schedule.start+" - "+schedule.end;
    });

    return finalSchedule;
};

// Форматування дати
export const formatDate = (date) => {
    const days = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];
    const months = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
        'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];

    return `${dayName}, ${day} ${month}`;
};

// Форматування короткої дати
export const formatShortDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};