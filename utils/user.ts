import Spotify from './spotify.js';
import DB from './db.js';

export default class User {
    id: string;
    display_name: string;
    image: string;

    constructor(id: string, display_name: string, image: string) {
        this.id = id;
        this.display_name = display_name;
        this.image = image;
    }

    static async getFromSpotify(spotifyUserId: string): Promise<User> {
        const spotifyUser = await Spotify.getUserById(spotifyUserId);

        return new User(
            spotifyUser.id,
            spotifyUser.display_name,
            spotifyUser.images.pop().url
        );
    }

    static async getFromDB(id: string): Promise<User> {
        const sql = "SELECT * FROM users WHERE id = ?;";
        const args = [id];

        try {
            const result = await DB.execute({ sql, args });
            const user = result[0];

            console.log(result);
            
            return new User(user.id, user.display_name, user.image);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    setInDB() {
        const sql = "INSERT OR REPLACE INTO users (id, display_name, image) VALUES (?, ?, ?);";
        const args = [this.id, this.display_name, this.image];

        try {
            return DB.execute({ sql, args });
        } catch (error) {
            console.error(error);
        }
    }
}
