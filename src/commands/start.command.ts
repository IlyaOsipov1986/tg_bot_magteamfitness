import { Markup, Telegraf } from "telegraf"; 
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { getMainMenuAdmin, getMainMenuUser } from "../utils/keyboards";
import { resetActiveAdmin } from "../utils/resetSession";
import { response } from "express";
import { text } from "stream/consumers";

export class StartCommand extends Command {

    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.start((ctx) => {
            console.log(ctx.session)
            resetActiveAdmin(ctx);
            ctx.reply('Добро пожаловать в бот! Подписавшись на канал, вы сможете получать свежие анонсы. После авторизации будет доступен гайд.',
            Markup.inlineKeyboard([
                Markup.button.url('Подписаться на канал', 'https://t.me/podnimaemoreh'),
                Markup.button.callback('Авторизоваться', 'user')
            ]))
              // ctx.reply('Добро пожаловать в бот! Войти как:', Markup.removeKeyboard())// Удаление клавиатуры
        });

        this.bot.action('user', (ctx) => {
            resetActiveAdmin(ctx);
            ctx.session.authType = "user";
            ctx.reply("Вы вошли как user", getMainMenuUser()); 
        })

        this.bot.command('admin', (ctx) => {
            resetActiveAdmin(ctx);
            ctx.session.authType = 'admin';    
            ctx.reply('Введите пароль администратора', Markup.removeKeyboard());
        })

        this.bot.on('text', (ctx) => {
            const typeAuth = ctx.session.authType;
            const adminActive = ctx.session.adminActive;
            if (typeAuth === 'admin' && !adminActive) {
                if (ctx.text === '89139214779') {
                    ctx.reply("Вы вошли как администратор", getMainMenuAdmin()); 
                    ctx.session.adminActive = true;
                } else {
                    ctx.reply("Неверный пароль");
                }
            }
        })
    }

    handleAdmin(): void {
        this.bot.action('listUsers', (ctx) => {
           ctx.reply('Тут будут список атлетов') 
        })
        
        this.bot.action('addUser', (ctx) => {
            ctx.reply('Тут будет форма добавления атлета')
        })

        this.bot.action('downloadGuide', (ctx) => {
            ctx.reply('Прикрепите файл')
        })

        this.bot.on('document', async (ctx) => {
            const typeAuth = ctx.session.authType;
            const adminActive = ctx.session.adminActive;
            const fileId = ctx?.update?.message?.document.file_id;
            if (typeAuth && adminActive) {
                ctx.telegram.getFileLink(fileId).then((link) => {
                    console.log(link);
                })
            }
        })
    }

    handleUser(): void {
        this.bot.action('Скачать программу тренировок', (ctx) => {
           ctx.reply('Скачивание программы тренировок'); 
        })
        
        this.bot.action('uploadGuide', (ctx) => {
            ctx.reply('Документ удачно загружен');
            ctx.replyWithDocument('BQACAgIAAxkBAAID8WcGjTwnBoGd_hNGAxaUv33GuHAMAAI0XAACBRU4SDRE4_XAkNpqNgQ');
        })
    }
}