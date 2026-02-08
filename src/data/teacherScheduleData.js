// src/data/teacherScheduleData.js
import {bellSchedule} from "./scheduleData";

// Розклад вчителя (Іваненко О.М.)
const teacherSchedule = {
    monday: [
        { id: "3", subject: "Алгебра", class: "10-А" },
        { id: "4", subject: "Алгебра", class: "10-А" },
        { id: "5", subject: "Геометрія", class: "9-Б" },
        { id: "6", subject: "Геометрія", class: "9-Б" },
    ],
    tuesday: [
        { id: "3", subject: "Геометрія", class: "10-А" },
        { id: "4", subject: "Геометрія", class: "10-А" },
        { id: "7", subject: "Алгебра", class: "10-А" },
        { id: "8", subject: "Алгебра", class: "10-А" },
    ],
    wednesday: [
        { id: "1", subject: "Алгебра", class: "10-А" },
        { id: "2", subject: "Алгебра", class: "10-А" },
        { id: "3", subject: "Алгебра", class: "11-А" },
        { id: "4", subject: "Алгебра", class: "11-А" },
    ],
    // ... і т.д.
    friday: [
        { id: "5", subject: "Алгебра", class: "10-А" },
        { id: "6", subject: "Алгебра", class: "10-А" },
    ]
};

export const getTeacherScheduleForDate = (date) => {
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return []; // Вихідні
    }

    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];

    const lessons = teacherSchedule[dayName] || [];

    return lessons.map(lesson => {
        const schedule = bellSchedule[Number(lesson.id) - 1];
        return {
            ...lesson,
            lessonNumber: lesson.id,
            time: schedule ? `${schedule.start} - ${schedule.end}` : "N/A"
        };
    });
};