// src/data/lessonMaterials.js

export const lessonMaterials = {
    // Алгебра, понеділок, пара 2 (уроки 3-4)
    "3:2025-11-03": {
        topic: "Логарифмічні рівняння",
        description: "Продовжуємо вивчати логарифмічні рівняння. Розглянемо складніші випадки та методи розв'язання.",
        materials: [
            {
                id: 1,
                type: "link",
                title: "Презентація до уроку",
                url: "https://docs.google.com/presentation/example",
                icon: "slideshow"
            },
            {
                id: 2,
                type: "file",
                title: "Конспект теми.pdf",
                url: "#",
                icon: "description"
            },
            {
                id: 3,
                type: "video",
                title: "Відеоурок: Логарифмічні рівняння",
                url: "https://youtube.com/watch?v=example",
                icon: "play_circle"
            }
        ],
    },

    // Українська мова, вівторок, пара 3 (уроки 5-6)
    "5:2025-11-04": {
        topic: "Складнопідрядні речення",
        description: "Вивчаємо види складнопідрядних речень, їх ознаки та правила пунктуації.",
        materials: [
            {
                id: 1,
                type: "link",
                title: "Правила пунктуації",
                url: "https://example.com/rules",
                icon: "article"
            },
            {
                id: 2,
                type: "file",
                title: "Вправи для практики.docx",
                url: "#",
                icon: "description"
            }
        ]
    },

    // Англійська мова, понеділок, пара 1 (уроки 1-2)
    "1:2025-11-03": {
        topic: "Unit 5: Artificial Intelligence",
        description: "Discussing the impact of AI on modern society. Vocabulary and grammar practice.",
        materials: [
            {
                id: 1,
                type: "file",
                title: "Vocabulary list.pdf",
                url: "#",
                icon: "description"
            },
            {
                id: 2,
                type: "video",
                title: "TED Talk: The Future of AI",
                url: "https://youtube.com/watch?v=example",
                icon: "play_circle"
            },
            {
                id: 3,
                type: "link",
                title: "Grammar exercises (online)",
                url: "https://example.com/grammar",
                icon: "link"
            }
        ]
    }
};

// Отримати матеріали для конкретного уроку
export const getMaterialsForLesson = (lessonId, date) => {
    return lessonMaterials[lessonId+":"+date] || null;
};

// Коментарі (для прикладу)
export const lessonComments = {
    "3:2025-11-03": [
        {
            id: 1,
            author: "Іваненко О.М.",
            role: "teacher",
            text: "Не забудьте здати домашнє завдання до кінця тижня!",
            date: "2025-11-03T10:30:00",
            avatar: null
        },
        {
            id: 2,
            author: "Петренко М.",
            role: "student",
            text: "Добрий день! Чи можна використовувати калькулятор на контрольній?",
            date: "2025-11-03T14:20:00",
            avatar: null
        }
    ]
};

// Отримати коментарі для уроку
export const getCommentsForLesson = (lessonId, date) => {
    return lessonComments[lessonId+":"+date] || [];
};

export const upsertLessonDetails = (lessonId, date, details) => {
    const key = `${lessonId}:${date}`;

    // Якщо для цього уроку ще немає запису, створюємо його
    if (!lessonMaterials[key]) {
        lessonMaterials[key] = {
            topic: "",
            description: "",
            materials: [],
            meetingLink: ""
        };
    }

    // Оновлюємо дані
    lessonMaterials[key].topic = details.topic;
    lessonMaterials[key].description = details.description;

    if (details.meetingLink !== undefined) {
        lessonMaterials[key].meetingLink = details.meetingLink;
    }

    console.log(`Збережено дані для ${key}:`, lessonMaterials[key]);
    return lessonMaterials[key];
};