// src/data/homeworkData.js

export const homeworkData = [
    {
        id: 1,
        date: "2025-11-03", // Дата, *на яку* задано ДЗ
        assignedDate: "2025-10-31",
        lessonId: "3",
        subject: "Алгебра",
        title: "Розв'язати задачі",
        description: "Завдання №45-52 з теми 'Логарифмічні рівняння'.",
        deadline: "14:25", // Час дедлайну в той самий день
        completed: false,
        estimatedTime: 45,
        attachments: []
    },
    {
        id: 2,
        date: "2025-11-04",
        assignedDate: "2025-10-28",
        lessonId: "5",
        subject: "Українська мова",
        title: "Виконати вправи в підручнику",
        description: "Завдання 7, 5 параграф 13.",
        deadline: "12:30",
        completed: false,
        estimatedTime: 45,
        attachments: []
    },
    {
        id: 3,
        date: "2025-11-10",
        assignedDate: "2025-11-05",
        lessonId: "1",
        subject: "Англійська мова",
        title: "Vocabulary p. 45",
        description: "Вивчити нові слова, написати 10 речень.",
        deadline: "08:50",
        completed: true, // Це вже здано, його не має бути в дедлайнах
        estimatedTime: 45,
        attachments: []
    },
    {
        id: 4,
        date: "2025-11-07",
        lessonId: "5",
        subject: "Алгебра",
        title: "Самостійна робота (підготовка)",
        description: "Повторити параграфи 10-12.",
        deadline: "08:50",
        completed: false,
        estimatedTime: 45,
        attachments: []
    }
];

// Отримати завдання за датою
export const getHomeworkByDate = (date) => {
    return homeworkData.filter(hw => hw.date === date);
};

export const getAllHomework = () => {
    return [...homeworkData].sort((a, b) => {
        const dateA = new Date(a.date); // Дедлайн
        const dateB = new Date(b.date);
        return dateA - dateB;
    });
};

// Отримати завдання для конкретного уроку
export const getHomeworkForLesson = (lessonId, date) => {
    return homeworkData.find(hw => hw.lessonId === lessonId && hw.date === date);
};

// Отримати кількість невиконаних завдань за датою
export const getIncompleteHomeworkCount = (date) => {
    return homeworkData.filter(hw => hw.date === date && !hw.completed).length;
};

export const getUpcomingDeadlines = (limit = 3) => {
    const today = new Date(/*"2025-11-03"*/); // Використовуємо поточну дату
    today.setHours(0, 0, 0, 0); // Скидаємо час для коректного порівняння

    const upcoming = homeworkData
        .filter(hw => {
            const hwDate = new Date(hw.date);
            // Беремо тільки невиконані ДЗ з сьогодні й на майбутнє
            return !hw.completed && hwDate >= today;
        })
        // Сортуємо: спочатку за датою (старіші перші),
        // а якщо дати однакові - за часом дедлайну
        .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (dateA - dateB !== 0) {
                return dateA - dateB;
            }
            // Якщо дати однакові, порівнюємо час
            return a.deadline.localeCompare(b.deadline);
        });

    return upcoming.slice(0, limit);
};

export const upsertHomework = (lessonId, date, subject, hwDetails) => {
    const key = `${lessonId}:${date}`;

    // Шукаємо, чи існує вже ДЗ
    let existingHw = homeworkData.find(hw => hw.lessonId === lessonId && hw.date === date);

    if (existingHw) {
        // Оновлюємо існуюче
        existingHw.title = hwDetails.title;
        existingHw.description = hwDetails.description;
        existingHw.deadline = hwDetails.deadline;
        console.log(`Оновлено ДЗ для ${key}:`, existingHw);
    } else {
        // Створюємо нове
        const newHw = {
            id: homeworkData.length + 100, // Унікальний ID
            date: date,
            lessonId: lessonId,
            subject: subject,
            title: hwDetails.title,
            description: hwDetails.description,
            deadline: hwDetails.deadline,
            completed: false,
            assignedDate: hwDetails.assignedDate || new Date().toISOString().split('T')[0], // Сьогодні
            estimatedTime: parseInt(hwDetails.estimatedTime) || 15,
            attachments: []
        };
        homeworkData.push(newHw);
        console.log(`Створено ДЗ для ${key}:`, newHw);
    }
};

export const calculateDailyWorkload = (targetDateString) => {
    const targetDate = new Date(targetDateString);
    targetDate.setHours(0,0,0,0);

    let totalMinutes = 0;

    // КОЕФІЦІЄНТ ПРОКРАСТИНАЦІЇ
    const K = 3; // 3 - золота середина (якщо 0 - ідеальна дитина, а 5 - здає все в останній день)

    homeworkData.forEach(hw => {
        const dueDate = new Date(hw.date);
        dueDate.setHours(0,0,0,0);

        // Дата видачі (або вчора, якщо не вказана)
        const assignedDate = hw.assignedDate ? new Date(hw.assignedDate) : new Date(dueDate);
        if (!hw.assignedDate) assignedDate.setDate(assignedDate.getDate() - 1);
        assignedDate.setHours(0,0,0,0);

        // Перевіряємо, чи входить наш Цільовий День у вікно завдання
        if (assignedDate <= targetDate && targetDate <= dueDate) {

            // 1. Рахуємо загальну тривалість вікна (в днях)
            const timeDiff = dueDate - assignedDate;
            const totalDaysDuration = Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24))); // N

            // 2. Рахуємо, який зараз день від початку (1-й, 2-й...)
            const currentDayDiff = targetDate - assignedDate;
            const currentDayIndex = Math.floor(currentDayDiff / (1000 * 60 * 60 * 24)) + 1; // i

            // 3. Рахуємо суму ваг для всіх днів (Знаменник)
            // Сума = 1^K + 2^K + ... + N^K
            let sumWeights = 0;
            for (let d = 1; d <= totalDaysDuration; d++) {
                sumWeights += Math.pow(d, K);
            }

            // 4. Рахуємо вагу поточного дня (Чисельник)
            const currentDayWeight = Math.pow(currentDayIndex, K);

            // 5. Фінальний розрахунок частки часу
            const estimatedTime = hw.estimatedTime || 20;
            const dailyLoad = estimatedTime * (currentDayWeight / sumWeights);

            totalMinutes += dailyLoad;
        }
    });

    return Math.round(totalMinutes);
};
