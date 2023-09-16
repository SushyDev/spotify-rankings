import User from './user.js';

export default class DataCookie {
    user: User;
    refresh_token: string;

    constructor(user: User, refresh_token: string) {
        this.user = user;
        this.refresh_token = refresh_token;
    }

    static getFromCookie(cookie: string): DataCookie {
        const data = JSON.parse(cookie);

        const user = new User(data.user.id, data.user.display_name, data.user.image);

        return new DataCookie(user, data.refresh_token);
    }
}

