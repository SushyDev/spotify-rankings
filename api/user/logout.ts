import type { VercelRequest, VercelResponse } from '@vercel/node';
import ErrorHandler from '../../utils/error-handling.js';

export default function handler(_request: VercelRequest, response: VercelResponse) {
    try {
        response.setHeader('Set-Cookie', `refresh_token=; path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0;`)

        response.redirect('http://localhost:3000/');
    } catch (error) {
        if (!(error instanceof Error)) return;
        ErrorHandler.handle(error, response);
    }
}
