import type { VercelRequest, VercelResponse } from '@vercel/node';
import User from '../../models/user.js';
import Group from '../../models/group.js';
import Token from '../../utils/token.js';
import ErrorHandler from '../../utils/error-handling.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    try {
        const { group_id } = request.body;

        if (!group_id) {
            throw new Error('Missing group_id');
        }

        const accessToken = Token.getFromHeaders(request.headers);

        const user = await User.getFromDiscordAccessToken(accessToken);

        const group = await Group.getById(group_id);

        if (!group) {
            throw new Error('Missing group');
        }

        const userInGroup = await group.userInGroup(user);

        if (!userInGroup) {
            throw new Error('User is not in group');
        }

        await group.delete();

        response.write('<html><head><meta http-equiv="refresh" content="0; url=/"></head></html>');
        response.end();
    } catch (error) {
        if (!(error instanceof Error)) return;

        ErrorHandler.handle(error, response);
    }
}
