import type { VercelResponse } from '@vercel/node';

export default class ErrorHandler {
    static handle(error: Error, response: VercelResponse) {
        const message = error.toString();
        response.status(400).send(message);
    }
}
