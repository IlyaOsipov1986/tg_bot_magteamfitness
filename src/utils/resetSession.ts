type resF = (ctx: any) => void;

export const resetActiveAdmin: resF = (ctx) => {
    ctx.session.adminActive = false;
    ctx.session.authType = '';
}