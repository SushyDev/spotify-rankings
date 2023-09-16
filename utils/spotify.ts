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
}
