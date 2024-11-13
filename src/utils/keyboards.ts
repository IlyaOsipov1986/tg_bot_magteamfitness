import { Markup } from "telegraf";

export function getMainMenuAdmin() {
    return Markup.inlineKeyboard([
        Markup.button.callback('Список атлетов', 'listUsers'),
        Markup.button.callback('Добавить атлета', 'addUser'),
        Markup.button.callback('Список гайдов', 'listGuides'),
        Markup.button.callback('Загрузить гайд', 'downloadGuide')
    ])
}

export function getMainMenuUser() {
    return Markup.inlineKeyboard([
        Markup.button.callback('Скачать гайд', 'uploadGuide'),
    ])
}

export function getSingleMenuGuide() {
    return Markup.inlineKeyboard([
        Markup.button.callback('Сделать основным', 'ActiveCurrentGuide'),
        Markup.button.callback('Удалить гайд', 'deleteGuide'),
    ])
}
