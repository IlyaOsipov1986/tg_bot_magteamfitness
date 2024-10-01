import { Markup } from "telegraf";

export function getMainMenuAdmin() {
    return Markup.inlineKeyboard([
        Markup.button.callback('Список атлетов', 'listUsers'),
        Markup.button.callback('Добавить атлета', 'addUser'),
        Markup.button.callback('Загрузить гайд', 'guid')
    ])
}

export function getMainMenuUser() {
    return Markup.keyboard([
        ['Скачать гайд']
    ]).resize();
}
