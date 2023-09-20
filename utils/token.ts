import type { IncomingHttpHeaders } from 'http';

export default class Token {
    static getFromHeaders(headers: IncomingHttpHeaders) {
        const token = headers['x-token'];

        if (!token || typeof token !== 'string') {
            throw new Error('Missing x-token header');
        }

        return token.split('=')[1];
    }
}
