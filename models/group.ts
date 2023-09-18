import type User from "./user.js";
import DB from "../utils/db.js";
import Invite from "./invite.js";

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

        try {
            const result = await DB.execute({ sql, args });

            if (result.rows.length === 0) return null;

            return result.rows.map((row: any) => new Group(row.id, row.name));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getById(id: number): Promise<Group | null> {
        const sql = "SELECT * FROM groups WHERE id = ?;";
        const args = [id];

        try {
            const result = await DB.execute({ sql, args });

            if (result.rows.length === 0) return null;

            const { id, name } = result.rows[0]

            if (typeof id !== 'number' || typeof name !== 'string') {
                throw new Error('Invalid id or name');
            }

            return new Group(id, name);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async create(name: string): Promise<Group> {
        const sql = "INSERT INTO groups (name) VALUES (?);";
        const args = [name];

        try {
            const result = await DB.execute({ sql, args });

            return new Group(Number(result.lastInsertRowid), name);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async addUser(user: User) {
        const sql = "INSERT INTO group_users (group_id, user_id) VALUES (?, ?);";
        const args = [this.id, user.id];

        try {
            return DB.execute({ sql, args });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async addPlaylist(playlist_id: string) {
        const sql = "INSERT INTO group_playlists (playlist_id, group_id) VALUES (?, ?);";
        const args = [playlist_id, this.id];

        try {
            return DB.execute({ sql, args });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // TODO: Remove any
    async getPlaylists(): Promise<Record<string, any>[]> {
        const sql = "SELECT * FROM group_playlists WHERE group_id = ?;";
        const args = [this.id];

        try {
            const result = await DB.execute({ sql, args });

            if (result.rows.length === 0) return [];

            return result.rows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async userInGroup(user: User): Promise<boolean> {
        const sql = "SELECT * FROM group_users WHERE group_id = ? AND user_id = ?;";
        const args = [this.id, user.id];

        try {
            const result = await DB.execute({ sql, args });

            return result.rows.length > 0;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
