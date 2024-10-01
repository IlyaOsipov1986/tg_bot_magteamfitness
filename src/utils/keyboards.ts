import { Markup } from "telegraf";

export function getMainMenuAdmin() {
    return Markup.keyboard([
        ['Список атлетов', 'Добавить атлета', 'Загрузить гайд']
    ]).resize();
}

export function getMainMenuUser() {
    return Markup.keyboard([
        ['Скачать гайд']
    ]).resize();
}
