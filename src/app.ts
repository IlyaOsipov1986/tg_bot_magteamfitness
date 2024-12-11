import { Telegraf } from "telegraf";
import { IConfigService } from "./config/config.interface.js";
import { ConfigService } from "./config/config.service.js";
import { IBotContext } from "./context/context.interface.js";
import { Command } from "./commands/command.class.js";
import { StartCommand } from "./commands/start.command.js";
import express from "express";
import LocalSession from "telegraf-session-local";
import { getGuides } from "./database/database.js";

const app = express();

class Bot {
    bot: Telegraf<IBotContext>;
    commands: Command[] = [];

    constructor(private readonly configService: IConfigService) {
        this.bot = new Telegraf<IBotContext>(this.configService.get("TOKEN"));
        this.bot.use(
            new LocalSession({ database: "sessions.json" }).middleware());
    }

    init() {
        this.commands = [new StartCommand(this.bot)]
        for(const command of this.commands) {
            command.handle();
            command.handleUser();
            command.handleAdmin();
        }
        this.bot.launch();
    }
}

class Routes {

    constructor() {}

    getGuides() {
        app.get('/guides', async (req, res) => {
            const guides = await getGuides().then((res: any) => res);
            res.send(guides);
        })
    }
}

const bot = new Bot(new ConfigService());
const routes = new Routes();
bot.init();

routes.getGuides();

app.listen(8080, () => {
    console.log('Server running')
})