import type { VercelRequest, VercelResponse } from '@vercel/node';
import Group from '../../models/group.js';
import ErrorHandler from '../../utils/error-handling.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    try {
        const { id } = request.query;

        if (!id || typeof id !== 'string') throw new Error('Invalid id');

        const groupId = parseInt(id);

        const group = await Group.getById(groupId);

        response.status(200).json(group);
    } catch (error) {
        if (!(error instanceof Error)) return;

        ErrorHandler.handle(error, response);
    }
}
