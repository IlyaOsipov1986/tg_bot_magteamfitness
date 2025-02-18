import { Markup, Telegraf } from "telegraf";
import { message } from "telegraf/filters"; 
import { Command } from "./command.class.js";
import { IBotContext } from "../context/context.interface.js";
import { getMainMenuAdmin, getMainMenuUser, getSingleMenuGuide } from "../utils/keyboards.js";
import { resetActiveAdmin } from "../utils/utils.js";
import { createGuide, createUser, deleteGuide, findGuide, findUser, setMainGuide }  from "../database/database.js";
import { getTitleGuideForButtonsMenu } from "../utils/utils.js";
import { findMainGuide } from "../utils/utils.js";
import { config } from "dotenv";
import { md5 } from 'js-md5';

export class StartCommand extends Command {
    webAppUrl: string | undefined;
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
        const { parsed } = config();
        this.webAppUrl = parsed?.WEB_APP_URL;
    }

    handle(): void {
        this.bot.start( async (ctx) => {
            resetActiveAdmin(ctx);
            const userId = ctx.message.chat.id;
            const foundUser = await findUser(userId);
            if (foundUser) {
                ctx.session.authType = "user";
                ctx.reply("Вы вошли как user", getMainMenuUser());
            } else {
                ctx.replyWithHTML(`Добро пожаловать в бот! <a href='https://t.me/podnimaemoreh'>Подписавшись на канал</a>, вы сможете получать свежие анонсы. После регистрации будет доступен гайд.`,
                Markup.keyboard([
                    Markup.button.webApp('Зарегистрироваться', `${this.webAppUrl}/register`)
                  ]).resize()
            )}
        });

        this.bot.on(message('web_app_data'), async (ctx) => {
            const dataFromWebApp = JSON.parse(ctx?.message?.web_app_data?.data);
            const userId = ctx.message.chat.id;
            const passToHash = md5(dataFromWebApp.password);
        
            if (dataFromWebApp) {

                const newUser = {
                    user_id: userId,
                    last_name: dataFromWebApp.last_name,
                    first_name: dataFromWebApp.first_name,
                    email: dataFromWebApp.email,
                    password: passToHash
                }

                try {
                    createUser(newUser)
                    .then((res) => {
                        ctx.reply('Вы зарегистрированы!', Markup.removeKeyboard());
                        ctx.reply("Вы вошли как user", getMainMenuUser());
                    })
                    .catch((err) => {
                        ctx.reply(`Ошибка регистрации! ${err.message}`)
                    });
                } catch(e) {
                    ctx.reply('Ошибка регистрации!')
                    console.log(e); 
                }
            }
        })

        this.bot.command('admin', (ctx) => {
            ctx.reply('Перейти в личный кабинет администратора',
            Markup.inlineKeyboard([
                    Markup.button.webApp('Авторизация', `${this.webAppUrl}/login`)
            ]))
        })
    }

    async handleAdmin(): Promise<void> {

        const {result, guides} = await getTitleGuideForButtonsMenu();
       
        this.bot.action('listUsers', (ctx) => {
           ctx.reply('Тут будут список атлетов', Markup.removeKeyboard()) 
        })
        
        this.bot.action('addUser', (ctx) => {
            ctx.reply('Тут будет форма добавления атлета', Markup.removeKeyboard())
        })

        this.bot.action('listGuides', async (ctx) => {
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

        this.bot.action('activeMainGuide', (ctx) => {
            const chatId: any = ctx?.update?.callback_query?.message?.chat.id;
            const messageId: any = ctx?.update?.callback_query?.message?.message_id;
            const title = ctx.session.titleGuide;
            setMainGuide(title)
            .then(() => {
                ctx.session.titleGuide = '';
                ctx.reply('Гайд выбран основным!');
            })
            .catch((error) => {
                ctx.reply(`Ошибка установки гайда (${error.message})!`); 
            });
            ctx.telegram.deleteMessage(chatId, messageId);
        })

        this.bot.action('deleteGuide', (ctx) => {
            const chatId: any = ctx?.update?.callback_query?.message?.chat.id;
            const messageId: any = ctx?.update?.callback_query?.message?.message_id;
            const title = ctx.session.titleGuide;
            deleteGuide(title)
            .then(() => {
                ctx.session.titleGuide = '';
            })
            .catch((error) => {
                ctx.reply(`Ошибка удаления гайда (${error.message})!`);
            });
            ctx.telegram.deleteMessage(chatId, messageId);
        })

        this.bot.action('downloadGuide', (ctx) => {
            ctx.session.adminDownLoadGuideActive = true;
            ctx.reply('Прикрепите документ', Markup.removeKeyboard())
        })

        this.bot.on(message('document'), async (ctx) => {
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
                
                const foundGuid = await findGuide(titleForGuide);

                if (foundGuid && Object.values(foundGuid).length > 0) {
                    ctx.reply('Гайд с таким названием уже существует!');
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

    async handleUser(): Promise<void> {

        const {guides} = await getTitleGuideForButtonsMenu();
    
        this.bot.action('Скачать программу тренировок', (ctx) => {
           ctx.reply('Скачивание программы тренировок'); 
        })
        
        this.bot.action('uploadGuide', (ctx) => {
            const actualGuide = findMainGuide(guides);
            ctx.replyWithDocument(actualGuide).then((res) => {
                ctx.reply('Гайд получен!');
            }).catch((error) => {
                ctx.reply(`Ошибка загрузки гайда (${error.message})!`);
            });
        })
    }
}