import { Context } from "telegraf";

export interface SessionData {
    authType: string;
    adminActive: boolean;
    adminDownLoadGuideActive: boolean;
    titleGuide: string;
}

export interface IBotContext extends Context {
    session: SessionData;
}