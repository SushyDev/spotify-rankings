import type { VercelRequest, VercelResponse } from '@vercel/node';
import Discord from '../../utils/discord.js';
import User from '../../models/user.js';

const discordAuthUrl = process.env.DISCORD_AUTH_URL || '';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    try {
        if (!request.url) throw new Error('Missing url');

        const url = new URL(request.url, 'http://0.0.0.0');
        const code = url.searchParams.get('code');
        url.searchParams.delete('code');

        if (!code) {
            response.redirect(discordAuthUrl);
            return;
        }

        const { access_token, refresh_token } = await Discord.getTokenFromCode(code)
        const connections = await Discord.getConnections(access_token);
        const connection = Discord.getSpotifyConnection(connections);

        if (!connection) throw new Error('Missing spotify connection');

        const spotifyId = connection.id;
        const spotifyVerfied = connection.verified;

        if (!spotifyId || !spotifyVerfied) throw new Error('Missing spotify connection or not verified');

        const user = await User.getFromSpotify(spotifyId);
        await user.setInDB();

        response.setHeader('Set-Cookie', [
            `refresh_token=${refresh_token}; path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=31536000;`,
            `access_token=${access_token}; path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600;`
        ]);

        response.write('<html><head><meta http-equiv="refresh" content="0; url=/"></head></html>');
        response.end();
    } catch (error) {
        console.error(error);
        response.status(400).json({ error: error.message });
    }
}
