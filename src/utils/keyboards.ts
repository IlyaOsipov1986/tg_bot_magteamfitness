import { Markup } from "telegraf";

export function getMainMenuAdmin() {
    return Markup.keyboard([
        ['Список атлетов', 'Добавить атлета', 'Загрузить документ']
    ]).resize();
}

export function getMainMenuUser() {
    return Markup.keyboard([
        ['Скачать программу тренировок', 'Скачать документ']
    ]).resize();
}
