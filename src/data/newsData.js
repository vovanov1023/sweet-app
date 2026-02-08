// src/data/newsData.js

export const newsData = [
    {
        id: 1,
        title: "Батьківські збори",
        text: "Шановні батьки! У п'ятницю о 18:00 відбудуться збори в Zoom.",
        date: "2025-11-01",
        author: "Класний керівник"
    },
    {
        id: 2,
        title: "Екскурсія до музею",
        text: "Збираємось біля школи о 09:00. З собою мати воду.",
        date: "2025-10-28",
        author: "Адміністрація"
    }
];

export const addNews = (title, text) => {
    const newPost = {
        id: Date.now(),
        title,
        text,
        date: new Date().toISOString().split('T')[0],
        author: "Іваненко О.М."
    };
    // Додаємо на початок масиву
    newsData.unshift(newPost);
    return newsData;
};