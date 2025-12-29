import { QUERY_KEYS } from '@/shared/constants';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAuthStore } from '../stores';

export const useLogout = () => {
  const { logout } = useAuthStore();
    const navigate = useNavigate();
  const { t } = useTranslation();
  const mutation = useMutation({
    mutationKey: [QUERY_KEYS.AUTH.LOGOUT],
    mutationFn: logout,
    onSuccess: () => {
      navigate({ to: '/login' });
    },

    onError: (error) => {
      toast.error(t('auth.logout.logout_failed'));
      navigate({ to: '/login' });
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
