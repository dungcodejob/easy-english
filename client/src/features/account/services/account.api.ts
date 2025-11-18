import { apiClient } from '@/api/api.client';
import type { TypeSafe } from '@/types';
import type { User } from '../types';

export const accountApi = {
  getAccount: async () => apiClient.get<User>('/account'),

  updateAccount: async (id: string, account: TypeSafe) => {
    const response = await fetch(`/account/${id}`, {
      method: 'PUT',
      body: JSON.stringify(account),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  },
};
