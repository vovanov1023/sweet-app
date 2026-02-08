// src/utils/icsGenerator.js

import { getScheduleForDate } from "../data/scheduleData";

export const downloadScheduleICS = () => {
    // 1. Початок файлу календаря
    let icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Sweet App//School Schedule//UA",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH"
    ];

    // 2. Генеруємо події на найближчий тиждень
    const today = new Date();

    // Проходимось по наступних 7 днях
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);

        // Отримуємо уроки на цей день
        const lessons = getScheduleForDate(currentDate);

        lessons.forEach(lesson => {
            // Парсимо час (наприклад "08:50 - 09:35")
            const [startStr, endStr] = lesson.time.split(" - ");

            const startDate = setTime(currentDate, startStr);
            const endDate = setTime(currentDate, endStr);

            // Форматуємо дату для iCal (YYYYMMDDTHHMMSS)
            const dtStart = formatDateICS(startDate);
            const dtEnd = formatDateICS(endDate);

            // Додаємо подію
            icsContent.push("BEGIN:VEVENT");
            icsContent.push(`UID:${lesson.id}-${dtStart}@sweet.app`);
            icsContent.push(`DTSTAMP:${formatDateICS(new Date())}`);
            icsContent.push(`DTSTART:${dtStart}`);
            icsContent.push(`DTEND:${dtEnd}`);
            icsContent.push(`SUMMARY:${lesson.subject} (${lesson.room || 'Онлайн'})`);
            icsContent.push(`DESCRIPTION:Вчитель: ${lesson.teacher || 'Не вказано'}`);
            icsContent.push("END:VEVENT");
        });
    }

    // 3. Кінець файлу
    icsContent.push("END:VCALENDAR");

    // 4. Створюємо файл і скачуємо його
    const blob = new Blob([icsContent.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "rozklad_sweet.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Допоміжні функції
const setTime = (date, timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0);
    return newDate;
};

const formatDateICS = (date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
};