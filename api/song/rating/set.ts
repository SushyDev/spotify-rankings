import type { VercelRequest, VercelResponse } from '@vercel/node';
import User from '../../../models/user.js';
import DB from '../../../utils/db.js';

class Rating {
    static async hasRated(
        song_id: string,
        user_id: string,
        group_id: number,
        playlist_id: string
    ): Promise<boolean> {
        const sql = 'SELECT * FROM song_ratings WHERE song_id = ? AND user_id = ? AND group_id = ? AND playlist_id = ?';
        const args = [song_id, user_id, group_id, playlist_id];

        try {
            const result = await DB.execute({ sql, args });

            return result.rows.length > 0;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    static async set(
        song_id: string,
        user_id: string,
        group_id: number,
        playlist_id: string,
        rating: number
    ): Promise<boolean> { 
        const sql = 'INSERT OR REPLACE INTO song_ratings (song_id, user_id, group_id, playlist_id, rating) VALUES (?, ?, ?, ?, ?)';
        const args = [song_id, user_id, group_id, playlist_id, rating];

        try {
            await DB.execute({ sql, args });

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
    try {
        const {
            song_id,
            group_id: group_id_str,
            playlist_id,
            rating: rating_str
        } = request.body;

        const tokenHeader = request.headers['x-token']

        if (!tokenHeader || typeof tokenHeader !== 'string') {
            throw new Error('Invalid access token');
        }

        const accessToken = tokenHeader.split('=')[1];

        const user = await User.getFromDiscordAccessToken(accessToken);

        const group_id = parseInt(group_id_str);
        const rating = parseInt(rating_str);

        if (!song_id || typeof song_id !== 'string') throw new Error('Invalid id');
        if (!group_id || typeof group_id !== 'number') throw new Error('Invalid id');
        if (!playlist_id || typeof playlist_id !== 'string') throw new Error('Invalid id');
        if (!rating || typeof rating !== 'number') throw new Error('Invalid rating');

        await Rating.set(song_id, user.id, group_id, playlist_id, rating);

        response.redirect(`/group/${group_id}/playlist/${playlist_id}`);
    } catch (error) {
        console.error(error);
        return response.status(400).json({ error: error });
    }
}
