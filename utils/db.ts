import { createClient } from "@libsql/client/web";

if (!process.env.TURSO_DB_URL) {
    throw new Error("Missing TURSO_DB_URL");
}

if (!process.env.TURSO_DB_TOKEN) {
    throw new Error("Missing TURSO_DB_TOKEN");
}

export default createClient({
    url: process.env.TURSO_DB_URL,
    authToken: process.env.TURSO_DB_TOKEN
});
