// src/data/classData.js

export const classData = {
    "10a": [
        { id: "s1", name: "Авраменко Дмитро" },
        { id: "s2", name: "Бойко Олена" },
        { id: "s3", name: "Василенко Ігор" },
        { id: "s4", name: "Гриценко Марія" },
        { id: "s5", name: "Демченко Артем" },
        { id: "s6", name: "Захарчук Вікторія" },
        { id: "s7", name: "Ковальчук Андрій" },
        { id: "s8", name: "Лисенко Ірина" },
        { id: "s9", name: "Мельник Олег" },
        { id: "s10", name: "Новицький Володимир" }, // Наш учень-тестувальник :)
        { id: "s11", name: "Романенко Софія" },
        { id: "s12", name: "Сидоренко Євген" },
        { id: "s13", name: "Петренко Максим"}
    ]
    // Тут можна додати "10b", "11a" і т.д.
};

export const getStudentsByClass = (className) => {
    return classData[className] || [];
};