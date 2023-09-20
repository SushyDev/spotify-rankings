import type User from "./user.js";
import DB from "../utils/db.js";

export default class Group {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    static async getAllByUser(user: User): Promise<Group[] | null> {
        const sql = "SELECT * FROM groups WHERE id IN (SELECT group_id FROM group_users WHERE user_id = ?);";
        const args = [user.id];

        const result = await DB.execute({ sql, args });

        if (result.rows.length === 0) return null;

        return result.rows.map((row: any) => new Group(row.id, row.name));
    }

    static async getById(group_id: number): Promise<Group | null> {
        const sql = "SELECT * FROM groups WHERE id = ?;";
        const args = [group_id];

        const result = await DB.execute({ sql, args });

        if (result.rows.length === 0) return null;

        const { id, name } = result.rows[0]

        if (typeof id !== 'number' || typeof name !== 'string') {
            throw new Error('Invalid id or name');
        }

        return new Group(id, name);
    }

    static async create(name: string): Promise<Group> {
        const sql = "INSERT INTO groups (name) VALUES (?);";
        const args = [name];

        const result = await DB.execute({ sql, args });

        return new Group(Number(result.lastInsertRowid), name);
    }

    async delete() {
        const sql = "DELETE FROM groups WHERE id = ?;";
        const args = [this.id];

        return DB.execute({ sql, args });
    }

    async addUser(user: User) {
        const sql = "INSERT INTO group_users (user_id, group_id) VALUES (?, ?);";
        const args = [user.id, this.id];

        return DB.execute({ sql, args });
    }

    async addPlaylist(playlist_id: string) {
        const sql = "INSERT INTO group_playlists (playlist_id, group_id) VALUES (?, ?);";
        const args = [playlist_id, this.id];

        return DB.execute({ sql, args });
    }

    async deletePlaylist(playlist_id: string) {
        const sql = "DELETE FROM group_playlists WHERE playlist_id = ? AND group_id = ?;";
        const args = [playlist_id, this.id];

        return DB.execute({ sql, args });
    }

    async getPlaylists(): Promise<Record<string, any>[]> {
        const sql = "SELECT * FROM group_playlists WHERE group_id = ?;";
        const args = [this.id];

        const result = await DB.execute({ sql, args });

        if (result.rows.length === 0) return [];

        return result.rows;
    }

    async userInGroup(user: User): Promise<boolean> {
        const sql = "SELECT * FROM group_users WHERE group_id = ? AND user_id = ?;";
        const args = [this.id, user.id];

        const result = await DB.execute({ sql, args });

        return result.rows.length > 0;
    }
}
