import { defineMiddleware } from "astro:middleware";
import Discord from '@utils/discord.js';
import User from '@models/user.js';

async function getUser(access_token: string): Promise<User> {
    const connections = await Discord.getConnections(access_token);
    const connection = Discord.getSpotifyConnection(connections);

    if (!connection) throw new Error('Missing spotify connection');

    const spotifyId = connection.id;
    const spotifyVerfied = connection.verified;

    if (!spotifyId || !spotifyVerfied) throw new Error('Missing spotify connection or not verified');

    return await User.getFromSpotify(spotifyId);
}


export const onRequest = defineMiddleware(async (context, next) => {
    const hasAccessToken = context.cookies.has('access_token');

    if(hasAccessToken) {
        const access_token = context.cookies.get('access_token').value;
        context.locals.user = await getUser(access_token);
    }

    next()
})
