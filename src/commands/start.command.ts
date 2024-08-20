import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";

export class StartCommand extends Command {

    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.start((ctx) => {
            console.log(ctx.session)
            ctx.reply('Вам понравился курс?', Markup.inlineKeyboard([
                Markup.button.callback('\xF0\x9F\x91\x8D', 'course_like'),
                Markup.button.callback('\xF0\x9F\x91\x8E', 'course_dislike')
            ]))
        });

        this.bot.action("course_like", (ctx) => {
            ctx.session.courseLike = true;
            ctx.editMessageText("Круто");
        })

        this.bot.action("course_dislike", (ctx) => {
            ctx.session.courseLike = false;
            ctx.editMessageText("Плохо");
        })
    }
}