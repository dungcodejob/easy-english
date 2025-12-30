import { APP_ROUTES, QUERY_KEYS } from '@/shared/constants';
import { toast } from '@/shared/utils/toast';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { authApi } from '../services/auth.api';
import type { RegisterCredentials } from '../types';

export const useRegister = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: [QUERY_KEYS.AUTH.REGISTER],
    mutationFn: (data: RegisterCredentials) => authApi.register(data),
    onSuccess: (result) => {
        if (result.isOk()) {
            navigate({ to: APP_ROUTES.AUTH.LOGIN });
            return;
        }

        // const error = result.error;
        const errorMessage = t('auth.register.error.default');
        
        // Handle specific error codes if needed, for now just show default or server message
        toast.error(errorMessage);
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message.includes('Network Error')
            ? t('auth.register.error.network_error')
            : t('auth.register.error.default')
          : t('auth.register.error.default');

      toast.error(errorMessage);
    },
  });

  return {
    ...mutation,
    mutateAsync: async (data: RegisterCredentials) => {
        const result = await mutation.mutateAsync(data);
        if (result.isErr()) {
             // Let the onError or manual handling deal with it, but here we can throw or just return
             throw result.error;
        }
        
        toast.success(t('auth.register.success'));
        return result.value;
    }
  };
};
