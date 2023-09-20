const { createClient } = process.env.NODE_ENV === "production" 
    ? await import ("@libsql/client/web")
    : await import ("@libsql/client");

if (!process.env.TURSO_DB_URL) {
    throw new Error("Missing TURSO_DB_URL");
}

if (!process.env.TURSO_DB_TOKEN) {
    throw new Error("Missing TURSO_DB_TOKEN");
}

const client = createClient({
    url: process.env.TURSO_DB_URL,
    authToken: process.env.TURSO_DB_TOKEN
});

const result = await client.execute(`PRAGMA foreign_keys;`);

export default client;
