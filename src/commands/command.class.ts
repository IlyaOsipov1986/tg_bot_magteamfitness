import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface.js";

export abstract class Command {
    constructor(public bot: Telegraf<IBotContext>) {}
    abstract handle(): void;
    abstract handleUser(): void;
    abstract handleAdmin(): void;
}