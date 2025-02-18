import { Telegraf } from "telegraf";
import { IConfigService } from "./config/config.interface.js";
import { ConfigService } from "./config/config.service.js";
import { IBotContext } from "./context/context.interface.js";
import { Command } from "./commands/command.class.js";
import { StartCommand } from "./commands/start.command.js";
import express from "express";
import LocalSession from "telegraf-session-local";
import { getGuides } from "./database/database.js";
import { config } from "dotenv";
import cors from "cors";
import { errorHandlingMiddleware } from "./utils/server/middleware/errorHandlingMiddleware.js";

const { parsed } = config();
const PORT = parsed?.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

//Обработка ошибок, последний Middleware
app.use(errorHandlingMiddleware);

const start = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server running ${PORT}`);
        })
    } catch(e) {
        console.log(e);
    }
}
 
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
    url: string | undefined
    constructor() {}

    getGuides(url: string) {
        this.url = url;
        
            app.get(this.url, async (req, res) => {
                const guides = await getGuides().then((res: any) => res);
                res.send(guides);
            })
    }
}

const bot = new Bot(new ConfigService());
const routes = new Routes();
bot.init();
start();

routes.getGuides('/guides');

