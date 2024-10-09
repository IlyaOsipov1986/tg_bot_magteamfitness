type resActiveAdminFnType = (ctx: any) => void;

export const resetActiveAdmin: resActiveAdminFnType = (ctx) => {
    ctx.session.adminActive = false;
    ctx.session.authType = '';
}