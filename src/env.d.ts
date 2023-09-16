/// <reference types="astro/client" />

interface User {
    id: string;
    display_name: string;
    image: string;
}

interface DataCookie {
    user: User;
    refresh_token: string;
}
