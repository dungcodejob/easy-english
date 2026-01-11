import { APP_ROUTES, QUERY_KEYS } from '@/shared/constants';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";
import { useAuthStore } from '../stores';
import type { LoginCredentials } from '../types';

interface UseLoginOptions {
  redirectTo?: string;
}

export const useLogin = (options: UseLoginOptions = {}) => {
  const { login } = useAuthStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect =
    options.redirectTo || new URLSearchParams(location.search).get('redirect');

  const mutation = useMutation({
    mutationKey: [QUERY_KEYS.AUTH.LOGIN],
    mutationFn: (data: LoginCredentials) => login(data),
    onSuccess: () => {
      navigate({ to: redirect || APP_ROUTES.ROOT });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message.includes('Network Error')
            ? t('auth.login.error.network_error')
            : t('auth.login.error.invalid_credentials')
          : t('auth.login.error.invalid_credentials');

      toast.error(errorMessage);
    },
  });

  return {
    ...mutation,
    mutateAsync: (data: LoginCredentials) =>
      toast.promise(mutation.mutateAsync(data), {
        loading: t('auth.login.logging_in'),
        success: t('auth.login.login_success'),
        error: t('auth.login.login_failed'),
      }),
  };
};
