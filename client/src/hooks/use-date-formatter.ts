import { format, formatDistance, isValid } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useCallback } from 'react';

export const useDateFormatter = () => {
  const formatDate = useCallback(
    (date: Date | string | number | undefined, pattern = 'dd/MM/yyyy') => {
      if (!date) {
        return '';
      }
      const dateObject = new Date(date);
      if (!isValid(dateObject)) {
        return '';
      }

      return format(dateObject, pattern, { locale: vi });
    },
    [],
  );

  const formatDateTime = useCallback(
    (
      date: Date | string | number | undefined,
      pattern = 'dd/MM/yyyy HH:mm:ss',
    ) => {
      if (!date) {
        return '';
      }
      const dateObject = new Date(date);
      if (!isValid(dateObject)) {
        return '';
      }

      return format(dateObject, pattern, { locale: vi });
    },
    [],
  );

  const getRelativeTime = useCallback((date: Date | string | number) => {
    const dateObject = new Date(date);
    if (!isValid(dateObject)) {
      return '';
    }

    return formatDistance(dateObject, new Date(), {
      addSuffix: true,
      locale: vi,
    });
  }, []);

  return { formatDate, getRelativeTime, formatDateTime };
};
