import { APP_ROUTES, QUERY_KEYS } from '@/shared/constants';
import { toast } from '@/shared/utils/toast';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores';

export const useLogout = () => {
  const { logout } = useAuthStore();
    const navigate = useNavigate();
  const { t } = useTranslation();
  const mutation = useMutation({
    mutationKey: [QUERY_KEYS.AUTH.LOGOUT],
    mutationFn: logout,
    onSuccess: () => {
      navigate({ to: APP_ROUTES.AUTH.LOGIN });
    },

    onError: () => {
      toast.error(t('auth.logout.logout_failed'));
      navigate({ to: APP_ROUTES.AUTH.LOGIN });
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
