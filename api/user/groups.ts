import type { VercelRequest, VercelResponse } from '@vercel/node';
import User from '../../models/user.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    try {
        if (!request.cookies.access_token) throw new Error('Missing access_token cookie');

        const user = await User.getFromDiscordAccessToken(request.cookies.access_token);

        const groups = await user.getGroups();

        response.status(200).json(groups);
    } catch (error) {
        console.error(error);
        return response.status(400).json({ error: error.message });
    }
}

