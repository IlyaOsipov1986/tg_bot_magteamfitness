import { IResultGuides } from "../commands/command.interface.js";
import { getGuides }  from "../database/database.js";

export const getTitleGuideForButtonsMenu = async() => {
    const guides = await getGuides().then((res: any) => res);
        const result: string[] = [];
        guides.forEach((elem: IResultGuides) => {
            result.push(elem.title)
        });
    return {result, guides};    
}

type resActiveAdminFnType = (ctx: any) => void;

export const resetActiveAdmin: resActiveAdminFnType = (ctx) => {
    ctx.session.adminActive = false;
    ctx.session.authType = '';
    ctx.session.adminDownLoadGuideActive = false;
    ctx.session.titleGuide = '';
}

export const findMainGuide = (guides: [IResultGuides]) => {
    const contentGuide = guides.find((el: IResultGuides) => el.mainGuide === 1);
    if(!contentGuide) {
        return '';
    }
    return contentGuide?.contents;
}
