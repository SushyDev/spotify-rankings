import { createHash } from 'crypto';

import type User from './user.js';
import DB from '../utils/db.js';
import Group from './group.js';

export default class Invite {
    id: number;
    group_id: number;
    invite_code: string;
    expire_date: Date;

    constructor(id: number, group_id: number, invite_code: string, expire_date: string) {
        this.id = id;
        this.group_id = group_id;
        this.invite_code = invite_code;
        this.expire_date = new Date(expire_date);
    }

    static #createInviteHash(group_id: number): string {
        const sha256Hash = createHash('sha256');
        sha256Hash.update(`${group_id}-${Date.now()}-${Math.random()}`);
        return sha256Hash.digest('hex').slice(0, 12);
    }

    static async create(group_id: number): Promise<string> {
        const group = await Group.getById(group_id);

        if (!group) {
            throw new Error('Group not found');
        }

        const invite_code = Invite.#createInviteHash(group_id);

        const sql = `INSERT INTO group_invites (invite_code, group_id, expire_date) VALUES (?, ?, datetime('now', '+7 days'))`;
        const args = [invite_code, group_id];

        const result = await DB.execute({ sql, args });

        if (result.rowsAffected !== 1) {
            throw new Error('Failed to create invite');
        }

        return invite_code;
    }

    async delete(invite_code: string): Promise<void> {
        const sql = `DELETE FROM group_invites WHERE invite_code = ?`;

        const args = [invite_code];

        const result = await DB.execute({ sql, args });

        if (result.rowsAffected !== 1) {
            throw new Error('Failed to delete invite');
        }
    }

    async use(user: User): Promise<void> {
        const sql = `INSERT INTO group_users (group_id, user_id) VALUES (?, ?)`;
        const args = [this.group_id, user.id];

        const result = await DB.execute({ sql, args });

        if (result.rowsAffected !== 1) {
            throw new Error('Failed to use invite');
        }

        await this.delete(this.invite_code);
    }

    static async getByCode(invite_code: string): Promise<Invite> {
        const sql = `SELECT * FROM group_invites WHERE invite_code = ?`;
        const args = [invite_code];

        const result = await DB.execute({ sql, args });

        if (result.rows.length === 0) {
            throw new Error('Invite not found');
        }

        const { id, group_id, expire_date } = result.rows[0];

        const idIsNumber = typeof id === 'number';
        const group_idIsNumber = typeof group_id === 'number';
        const expire_dateIsString = typeof expire_date === 'string';


        if (!idIsNumber || !group_idIsNumber || !expire_dateIsString) {
            throw new Error('Invalid id, group_id, expire_date or deleted_date');
        }

        const invite = new Invite(id, group_id, invite_code, expire_date);

        if (new Date(expire_date) < new Date()) {
            await invite.delete(invite_code);
            throw new Error('Invite expired');
        }

        return invite;
    }
}
