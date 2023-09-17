import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(request: VercelRequest, response: VercelResponse) {
    try {
        response.setHeader('Set-Cookie', [
            `access_token=; path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0;`,
            `refresh_token=; path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0;`
        ])

        response.redirect('http://localhost:3000/');
    } catch (error) {
        console.error(error);
        response.status(400).json({ error: error.message });
    }
}
