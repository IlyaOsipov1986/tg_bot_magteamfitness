import { Context } from "telegraf";

export interface SessionData {
    authType: string;
    adminActive: boolean;
}

export interface IBotContext extends Context {
    session: SessionData;
}