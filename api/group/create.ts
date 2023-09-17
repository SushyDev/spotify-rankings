import type { VercelRequest, VercelResponse } from '@vercel/node';
import User from '@models/user.js';
import Group from '@models/group.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    try {
        const { name } = request.body;

        if (!name) throw new Error('Missing name');

        if (!request.cookies.access_token) throw new Error('Missing access_token cookie');

        const user = await User.getFromDiscordAccessToken(request.cookies.access_token);

        const group = await Group.create(name);

        await group.addUser(user);

        response.write('<html><head><meta http-equiv="refresh" content="0; url=/"></head></html>');
        response.end();
    } catch (error) {
        console.error(error);
        return response.status(400).json({ error: error });
    }
}

