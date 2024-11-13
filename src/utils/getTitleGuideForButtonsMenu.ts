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