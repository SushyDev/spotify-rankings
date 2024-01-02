export namespace Spotify {
    export interface Artist {
        id: string;
        name: string;
    }

    export interface Image {
        url: string;
    }

    export interface Track {
        id: string;
        name: string;
        artists: Artist[];
        album: {
            images: Image[];
        }
        external_urls: {
            spotify: string;
        }
    }

    export interface Playlist {
        id: string;
        name: string;
        tracks: {
            items: { track: Track }[];
        };
    }
}

export default class Spotify {
    static clientID = process.env.SPOTIFY_CLIENT_ID;
    static clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    static grantType = 'client_credentials';
    static redirectURI = process.env.SPOTIFY_REDIRECT_URI;

    static async getToken() {
        const hashed = Buffer.from(`${Spotify.clientID}:${Spotify.clientSecret}`).toString('base64');

        const data = new URLSearchParams();
        data.append('grant_type', Spotify.grantType);

        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: 'POST',
            headers: {
                Authorization: `Basic ${hashed}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data,
        });

        if (!response.ok) {
            const error = await response.json();
            console.error(error);
            throw new Error('Could not get Spotify token');
        }

        return await response.json();
    }

    static async getUserById(id: string) {
        const { access_token } = await Spotify.getToken();

        const response = await fetch(`https://api.spotify.com/v1/users/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            console.error(error);
            throw new Error('Could not get Spotify user');
        }

        return await response.json();
    }

    static async getPlaylistById(id: string): Promise<Spotify.Playlist> {
        const { access_token } = await Spotify.getToken();

        const response = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            console.error(error, id);
            throw new Error('Could not get Spotify playlist');
        }

        return await response.json();
    }

    static async getAllPlaylistsByUserId(id: string): Promise<Spotify.Playlist[]> {
        const { access_token } = await Spotify.getToken();

        const response = await fetch(`https://api.spotify.com/v1/users/${id}/playlists`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            console.error(error);
            throw new Error('Could not get Spotify playlists');
        }

        const data = await response.json();
        return data.items;
    }
}
