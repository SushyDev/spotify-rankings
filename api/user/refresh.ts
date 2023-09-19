import type { VercelRequest, VercelResponse } from '@vercel/node';
import Discord from '../../utils/discord.js';
import User from '../../models/user.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    try {
        if (!request.cookies?.data) throw new Error('Missing data cookie');

        // const { refresh_token: refreshToken } = DataCookie.getFromCookie(request.cookies.data);
        //
        // const { access_token, refresh_token } = await Discord.getTokenFromRefreshToken(refreshToken)
        // const connections = await Discord.getConnections(access_token)
        // const connection = Discord.getSpotifyConnection(connections);
        //
        // if (!connection) throw new Error('Missing spotify connection');
        //
        // const spotifyId = connection.id;
        // const spotifyVerfied = connection.verified;
        //
        // if (!spotifyId || !spotifyVerfied) throw new Error('Missing spotify connection or not verified');
        //
        // const user = await User.getFromDB(spotifyId);
        // const data = { user, refresh_token };
        //
        // response.setHeader('Set-Cookie', `data=${JSON.stringify(data)}; HttpOnly; Path=/; Max-Age=31536000; SameSite=Strict; Secure`);
        //
        // response.redirect('http://localhost:3000/');
    } catch (error) {
        console.error(error);
        return response.status(400).json({ error: error });
    }
}
