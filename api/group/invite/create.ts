import type { VercelRequest, VercelResponse } from '@vercel/node';
import Invite from '../../../models/invite.js';
import ErrorHandler from '../../../utils/error-handling.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    try {
        const { group_id, invite_count } = request.body;

        if (!group_id || typeof group_id !== 'string') {
            throw new Error('Invalid group_id');
        }

        if (!invite_count || typeof invite_count !== 'string') {
            throw new Error('Invalid invite_count');
        }

        const groupId = parseInt(group_id);
        const inviteCount = parseInt(invite_count);

        const invitesPromises = [...Array(inviteCount)].map(() => Invite.create(groupId));
        const invites = await Promise.all(invitesPromises);
        const urlEncodedInvites = invites.map(encodeURIComponent).join(',');

        response.redirect(`/invites?codes=${urlEncodedInvites}`);
    } catch (error) {
        if (!(error instanceof Error)) return;

        ErrorHandler.handle(error, response);
    }
}
