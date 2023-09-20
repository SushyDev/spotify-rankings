import type { VercelRequest, VercelResponse } from '@vercel/node';
import ErrorHandler from '../../utils/error-handling.js';

export default function handler(_request: VercelRequest, response: VercelResponse) {
    try {
        response.setHeader('Set-Cookie', [
            `refresh_token=; path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0;`,
            `user=; path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0;`
        ])

        response.send('<html><head><meta http-equiv="refresh" content="0; url=/"></head></html>');
    } catch (error) {
        if (!(error instanceof Error)) return;

        ErrorHandler.handle(error, response);
    }
}
