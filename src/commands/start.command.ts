import { Markup, Telegraf } from "telegraf"; 
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { getMainMenuAdmin, getMainMenuUser } from "../utils/keyboards";

export class StartCommand extends Command {

    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.start((ctx) => {
            console.log(ctx.session)
            ctx.session.authType = "";
            ctx.reply('Добро пожаловать в бот! Подписавшись на канал, вы сможете получать свежие анонсы. После авторизации будет доступен гайд.',
            Markup.inlineKeyboard([
                Markup.button.url('Подписаться на канал', 'https://t.me/podnimaemoreh'),
                Markup.button.callback('Авторизоваться', 'user')
            ]))
              // ctx.reply('Добро пожаловать в бот! Войти как:', Markup.removeKeyboard())// Удаление клавиатуры
        });

        this.bot.action('user', (ctx) => {
            ctx.session.authType = "user";
            ctx.reply("Вы вошли как пользователь", getMainMenuUser(), ); 
        })

        this.bot.command('admin', (ctx) => {
            ctx.session.authType = "admin";
            ctx.reply('Введите пароль администратора', Markup.removeKeyboard());
        })

        this.bot.on('message', (ctx) => {
            const typeAuth = ctx.session.authType;
            if (typeAuth === 'admin') {
                if (ctx.text === '89139214779') {
                    console.log('ok')
                    ctx.reply("Вы вошли как администратор", getMainMenuAdmin()); 
                } else {
                    ctx.reply("Неверный пароль");
                }
            } else if(typeAuth === 'user') {
                if(ctx.text === 'Скачать гайд') {
                    ctx.reply('Скачивание документа')
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

        this.bot.action('guid', (ctx) => {
            ctx.reply('Загрузка документа')
        })
    }

    handleUser(): void {
        this.bot.hears('Скачать программу тренировок', (ctx) => {
           ctx.reply('Скачивание программы тренировок') 
        })
        
        this.bot.hears('Скачать документ', (ctx) => {
            ctx.reply('Скачивание документа')
        })
    }
}