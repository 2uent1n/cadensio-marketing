import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { ContactsApi, ContactsApiApiKeys } from '@getbrevo/brevo';

export const server = {
  createWaitlistEntry: defineAction({
    input: z.object({ email: z.string().email() }),
    handler: async ({ email }) => {
      const api = new ContactsApi();
      const apiKey = import.meta.env.BREVO_API_KEY;
      const waitingListId = parseInt(import.meta.env.BREVO_WAITING_LIST_ID);

      api.setApiKey(ContactsApiApiKeys.apiKey, apiKey);

      try {
        await api.createContact({ email });
        await api.addContactToList(waitingListId, { emails: [email] });
        return { success: true };
      } catch {
        console.error(`Error adding '${email}' to waiting list.`);
        return { success: false };
      }
    },
  }),
};
