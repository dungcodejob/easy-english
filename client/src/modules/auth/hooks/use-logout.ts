import { QUERY_KEYS } from '@/shared/constants';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAuthStore } from '../stores';

export const useLogout = () => {
  const { logout } = useAuthStore();
  const { t } = useTranslation();
  const mutation = useMutation({
    mutationKey: [QUERY_KEYS.AUTH.LOGOUT],
    mutationFn: logout,
    onError: (error) => {
      toast.error(t('auth.logout.logout_failed'));
    },
  });

  return {
    ...mutation,
    mutateAsync: () =>
      toast.promise(mutation.mutateAsync(), {
        loading: t('auth.logout.logging_out'),
        success: t('auth.logout.logout_success'),
        error: t('auth.logout.logout_failed'),
      }),
  };
};
