import type { VercelRequest, VercelResponse } from '@vercel/node';
import User from '../../../models/user.js';
import Group from '../../../models/group.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    try {
        console.info('Handler called');
        const { group_id, playlist_id } = request.body;

        if (!group_id) throw new Error('Missing group_id');
        if (!playlist_id) throw new Error('Missing spotify_playlist_id');

        if (!request.cookies.access_token) throw new Error('Missing access_token cookie');

        const user = await User.getFromDiscordAccessToken(request.cookies.access_token);

        const group = await Group.getById(group_id);

        if (!group) throw new Error('Missing group');

        const userInGroup = await group.userInGroup(user);

        if (!userInGroup) throw new Error('User is not in group');

        await group.addPlaylist(playlist_id);

        response.write('<html><head><meta http-equiv="refresh" content="0; url=/"></head></html>');
        response.end();
    } catch (error) {
        console.error(error);
        return response.status(400).json({ error: error.message });
    }
}
