type connection = {
    id: string;
    type: string;
    verified: boolean;
}

export default class Discord {
    static clientID = process.env.DISCORD_CLIENT_ID;
    static clientSecret = process.env.DISCORD_CLIENT_SECRET;
    static grantType = 'authorization_code';
    static redirectURI = process.env.DISCORD_REDIRECT_URI;
    static scope = 'identify connections';

    static async getTokenFromCode(code: string) {
        const data = new FormData();

        if (!Discord.clientID || !Discord.clientSecret || !Discord.redirectURI) {
            throw new Error('Discord client ID, client secret, or redirect URI is not defined');
        }

        data.append('client_id', Discord.clientID);
        data.append('client_secret', Discord.clientSecret);
        data.append('grant_type', Discord.grantType);
        data.append('code', code);
        data.append('redirect_uri', Discord.redirectURI);
        data.append('scope', Discord.scope);

        const response = await fetch("https://discord.com/api/oauth2/token", {
            method: 'POST',
            body: data,
        });

        if (!response.ok) {
            const error = await response.json();
            console.error(error);
            throw new Error('Could not get Discord token');
        }

        return await response.json();
    }

    static async getTokenFromRefreshToken(refreshToken: string) {
        const data = new FormData();

        if (!Discord.clientID || !Discord.clientSecret || !Discord.redirectURI) {
            throw new Error('Discord client ID, client secret, or redirect URI is not defined');
        }

        data.append('client_id', Discord.clientID);
        data.append('client_secret', Discord.clientSecret);
        data.append('grant_type', 'refresh_token');
        data.append('refresh_token', refreshToken);

        const response = await fetch("https://discord.com/api/oauth2/token", {
            method: 'POST',
            body: data,
        });

        if (!response.ok) {
            const error = await response.json();
            console.error(error);
            throw new Error('Could not get Discord token');
        }

        return await response.json();
    }

    static async getConnections(accessToken: string): Promise<connection[]> {
        const response = await fetch("https://discord.com/api/users/@me/connections", {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            console.error(error);
            throw new Error('Could not get Discord connections');
        }

        return await response.json() as connection[];
    }

    static getSpotifyConnection(connections: connection[]) {
        return connections.find((connection) => connection.type === 'spotify');
    }
}
