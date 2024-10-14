import { Markup, Telegraf } from "telegraf";
import { message } from "telegraf/filters"; 
import { Command } from "./command.class.js";
import { IBotContext } from "../context/context.interface.js";
import { getMainMenuAdmin, getMainMenuUser } from "../utils/keyboards.js";
import { resetActiveAdmin } from "../utils/resetSession.js";
import { getGuides }  from "../database/database.js";

const guides = await getGuides()
    .then((res: any) => res);

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

        this.bot.on(message("text"), (ctx) => {
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

        this.bot.action('listGuides', (ctx) => {
            ctx.reply('Список гайдов')
        })

        this.bot.action('downloadGuide', (ctx) => {
            ctx.reply('Прикрепите файл')
        })

        this.bot.on(message('document'), async (ctx) => {
            const typeAuth = ctx.session.authType;
            const adminActive = ctx.session.adminActive;
            const fileId = ctx?.update?.message?.document?.file_id;
            if (typeAuth === 'admin' && adminActive) {
                ctx.telegram.getFileLink(fileId).then((link) => {
                    if(link) {
                        console.log(fileId);
                    }
                }).catch((err) => {
                    ctx.reply(`Ошибка загрузки документа (${err.message})!`);
                })
            }
        })
    }

    handleUser(): void {
        this.bot.action('Скачать программу тренировок', (ctx) => {
           ctx.reply('Скачивание программы тренировок'); 
        })
        
        this.bot.action('uploadGuide', (ctx) => {
            //BQACAgIAAxkBAAIEM2cI8XnDNqjWlU8RxLjk5HdGgQABGQACi1UAAk6pSUhHM0jxeve77zYE
            ctx.replyWithDocument('BQACAgIAAxkBAAIEM2cI8XnDNqjWlU8RxLjk5HdGgQABGQACi1UAAk6pSUhHM0jxeve77zYE').then((res) => {
                ctx.reply('Гайд получен!');
            }).catch((error) => {
                ctx.reply(`Ошибка загрузки гайда (${error.message})!`);
            });
        })
    }
}