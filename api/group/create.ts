import type { VercelRequest, VercelResponse } from '@vercel/node';
import User from '../../models/user.js';
import Group from '../../models/group.js';
import Token from '../../utils/token.js';
import ErrorHandler from '../../utils/error-handling.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    try {
        const { name } = request.body;

        if (!name) throw new Error('Missing name');

        const accessToken = Token.getFromHeaders(request.headers);

        const user = await User.getFromDiscordAccessToken(accessToken);

        const group = await Group.create(name);

        await group.addUser(user);

        response.write('<html><head><meta http-equiv="refresh" content="0; url=/"></head></html>');
        response.end();
    } catch (error) {
        if (!(error instanceof Error)) return;

        ErrorHandler.handle(error, response);
    }
}
