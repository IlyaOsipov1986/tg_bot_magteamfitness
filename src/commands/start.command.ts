import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { getMainMenuUser, getMainMenuAdmin } from "../utils/keyboards";

export class StartCommand extends Command {

    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.start((ctx) => {
            console.log(ctx.session)
            ctx.reply('Добро пожаловать в бот! Войти как:', Markup.inlineKeyboard([
                Markup.button.callback('Пользователь', 'user'),
                Markup.button.callback('Администратор', 'admin')
            ]))
        });

        this.bot.action("user", (ctx) => {
            ctx.session.authType = 'user';
            ctx.reply("Вы вошли как пользователь", getMainMenuUser()) 
        })

        this.bot.action("admin", (ctx) => {
            ctx.session.authType = 'admin';
            ctx.reply("Вы вошли как администратор", getMainMenuAdmin()) 
        })
    }
}