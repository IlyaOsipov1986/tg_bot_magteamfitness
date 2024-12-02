import { Markup, Telegraf } from "telegraf";
import { message } from "telegraf/filters"; 
import { Command } from "./command.class.js";
import { IBotContext } from "../context/context.interface.js";
import { getMainMenuAdmin, getMainMenuUser, getSingleMenuGuide } from "../utils/keyboards.js";
import { resetActiveAdmin } from "../utils/resetSession.js";
import { createGuide, deleteGuide, getGuides }  from "../database/database.js";
import { IResultGuides } from "../commands/command.interface.js";
import { getTitleGuideForButtonsMenu } from "../utils/getTitleGuideForButtonsMenu.js";

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
        });

        this.bot.action('user', (ctx) => {
            resetActiveAdmin(ctx);
            ctx.session.authType = "user";
            ctx.reply("Вы вошли как user", getMainMenuUser()); 
        })

        this.bot.command('admin', (ctx) => {
            const typeAuth = ctx.session.authType;
            if (typeAuth === 'admin') {
                ctx.reply("Вы вошли как администратор", getMainMenuAdmin());
                return; 
            }
            resetActiveAdmin(ctx);
            ctx.session.authType = 'admin';    
            ctx.reply('Введите пароль администратора', Markup.removeKeyboard());
        })

    }

    async handleAdmin(): Promise<void> {

        const {result, guides} = await getTitleGuideForButtonsMenu();
        console.log(guides)
        
        this.bot.action('listUsers', (ctx) => {
           ctx.reply('Тут будут список атлетов', Markup.removeKeyboard()) 
        })
        
        this.bot.action('addUser', (ctx) => {
            ctx.reply('Тут будет форма добавления атлета', Markup.removeKeyboard())
        })

        this.bot.action('listGuides', async (ctx) => {
            console.log(result)
            if (guides.length === 0) {
                ctx.reply('Список гайдов пуст!');
                return;
            }
            ctx.reply('Список гайдов загружен', Markup.keyboard(result.map((el) => Markup.button.callback(el, el))).oneTime().resize());
        })

        this.bot.hears(result, (ctx) => {
            const titleGuide = ctx?.update?.message?.text;
            if (titleGuide) {
                ctx.session.titleGuide = titleGuide;
                ctx.reply(`Название гайда "${titleGuide}"`, getSingleMenuGuide());
            }
        })

        this.bot.action('deleteGuide', (ctx) => {
            const chatId: any = ctx?.update?.callback_query?.message?.chat.id;
            const messageId: any = ctx?.update?.callback_query?.message?.message_id;
            ctx.telegram.deleteMessage(chatId, messageId);
            // const title = ctx.session.titleGuide;
            //  deleteGuide(title)
            // .then(() => {
            //     ctx.session.titleGuide = '';
            // })
            // .catch((error) => {
            //     ctx.reply(`Ошибка удаления гайда (${error.message})!`);
            // });
        })

        this.bot.action('downloadGuide', (ctx) => {
            ctx.session.adminDownLoadGuideActive = true;
            ctx.reply('Прикрепите документ', Markup.removeKeyboard())
        })

        this.bot.on(message('document'), (ctx) => {
            const typeAuth = ctx.session.authType;
            const adminActive = ctx.session.adminActive;
            const adminDownLoadGuide = ctx.session.adminDownLoadGuideActive;
            const fileId = ctx?.update?.message?.document?.file_id;
            const titleForGuide = ctx?.update?.message?.caption;
            if (typeAuth === 'admin' && adminActive && adminDownLoadGuide) {
                if (!titleForGuide) {
                    ctx.reply('Необходимо указать название документа при загрузке!');
                    return;
                }
                ctx.telegram.getFileLink(fileId).then(() => {
                    createGuide(titleForGuide, fileId);
                    ctx.session.adminDownLoadGuideActive = false;
                    ctx.reply('Гайд успешно загружен!', Markup.removeKeyboard());
                }).catch((err) => {
                    ctx.reply(`Ошибка загрузки документа (${err.message})!`);
                })
            }
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

    handleUser(): void {
        this.bot.action('Скачать программу тренировок', (ctx) => {
           ctx.reply('Скачивание программы тренировок'); 
        })
        
        this.bot.action('uploadGuide', (ctx) => {
            ctx.replyWithDocument('BQACAgIAAxkBAAIGCGc0SB1Pc2jU2T9EgQwV5TdqfKOsAAIwXQAC3NKpSQxBE5cyAAEtPjYE').then((res) => {
                ctx.reply('Гайд получен!');
            }).catch((error) => {
                ctx.reply(`Ошибка загрузки гайда (${error.message})!`);
            });
        })
    }
}