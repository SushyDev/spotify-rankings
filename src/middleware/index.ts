import { defineMiddleware } from "astro:middleware";
import User from '@models/user.js';

export const onRequest = defineMiddleware(async (context, next) => {
    const hasUser = context.cookies.has('user');

    if (!hasUser) {
        next();
        return;
    }

    const user = context.cookies.get('user')?.json();

    if (!user) {
        next();
        return;
    }

    context.locals.user = new User(user.id, user.name, user.image);

    next()
})
