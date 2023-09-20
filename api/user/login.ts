import type { VercelRequest, VercelResponse } from '@vercel/node';
import User from '../../models/user.js';
import Discord from '../../utils/discord.js';
import ErrorHandler from '../../utils/error-handling.js';

const discordAuthUrl = process.env.DISCORD_AUTH_URL || '';

export default async function(request: VercelRequest, response: VercelResponse) {
    try {
        if (!request.url) throw new Error('Missing url');

        const url = new URL(request.url, 'http://0.0.0.0');
        const code = url.searchParams.get('code');

        if (!code) {
            return response.redirect(discordAuthUrl);
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
            `user=${JSON.stringify(user)}; path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=31536000;`
        ]);

        response.send('<html><head><meta http-equiv="refresh" content="0; url=/"></head></html>');
    } catch (error) {
        if (!(error instanceof Error)) return;

        ErrorHandler.handle(error, response);
    }
}
