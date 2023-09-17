import Discord from '../utils/discord.js';
import Spotify from '../utils/spotify.js';
import DB from '../utils/db.js';

export default class User {
    id: string;
    name: string;
    image: string;

    constructor(id: string, name: string, image: string) {
        this.id = id;
        this.name = name;
        this.image = image;
    }

    static async getFromDiscordAccessToken(access_token: string): Promise<User> {
        const connections = await Discord.getConnections(access_token);
        const connection = Discord.getSpotifyConnection(connections);

        if (!connection) throw new Error('Missing spotify connection');

        const spotifyId = connection.id;
        const spotifyVerfied = connection.verified;

        if (!spotifyId || !spotifyVerfied) throw new Error('Missing spotify connection or not verified');

        return await User.getFromSpotify(spotifyId);
    }

    static async getFromSpotify(spotifyUserId: string): Promise<User> {
        const spotifyUser = await Spotify.getUserById(spotifyUserId);

        return new User(
            spotifyUser.id,
            spotifyUser.display_name,
            spotifyUser.images.pop()?.url ?? ''
        );
    }

    static async getFromDB(id: string): Promise<User> {
        const sql = "SELECT * FROM users WHERE id = ?;";
        const args = [id];

        try {
            const result = await DB.execute({ sql, args });
            const user = result.rows[0];

            if (!user) throw new Error('User not found');
            if (typeof user.id !== 'string' || typeof user.name !== 'string' || typeof user.image !== 'string') {
                throw new Error('Invalid user');
            }
            
            return new User(user.id, user.name, user.image);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    setInDB() {
        const sql = "INSERT OR REPLACE INTO users (id, name, image) VALUES (?, ?, ?);";
        const args = [this.id, this.name, this.image];

        try {
            return DB.execute({ sql, args });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getGroups() {
        const sql = "SELECT groups.id, groups.name FROM groups INNER JOIN group_users ON groups.id = group_users.group_id WHERE group_users.user_id = ?;";
        const args = [this.id];

        try {
            const result = await DB.execute({ sql, args });

            return result.rows
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
