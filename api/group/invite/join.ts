import type { VercelRequest, VercelResponse } from '@vercel/node';

import User from '../../../models/user.js';
import Invite from '../../../models/invite.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    try {
        if (!request.cookies.access_token) throw new Error('Missing access_token cookie');

        const user = await User.getFromDiscordAccessToken(request.cookies.access_token);

        const { invite_code } = request.query;

        if (!invite_code || typeof invite_code !== 'string') throw new Error('Invalid invite_code');

        const invite = await Invite.getByCode(invite_code);

        if (!invite) throw new Error('Invalid invite_code');

        invite.use(user)

        response.write('<html><head><meta http-equiv="refresh" content="0; url=/"></head></html>');
        response.end();
    } catch (error) {
        console.error(error);
        return response.status(400).json({ error: error });
    }
}
