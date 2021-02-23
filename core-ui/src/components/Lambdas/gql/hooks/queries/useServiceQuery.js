import { useState, useEffect } from 'react';
import { useNotification } from 'react-shared';
import { useGet } from 'react-shared';

import { formatMessage } from 'components/Lambdas/helpers/misc';
import { GQL_QUERIES } from 'components/Lambdas/constants';
import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

export const useServiceQuery = ({ name, namespace }) => {
  const notificationManager = useNotification();

  const {
    data,
    error,
    loading,
  } = useGet(`/api/v1/namespaces/${namespace}/services/${name}`, {
    pollingInterval: 3000000,
  });
  const service = data;

  useEffect(() => {
    if (error) {
      const errorToDisplay = extractGraphQlErrors(error);

      const message = formatMessage(GQL_QUERIES.SERVICE.ERROR_MESSAGE, {
        serviceName: name,
        error: errorToDisplay,
      });

      notificationManager.notifyError({
        content: message,
        autoClose: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return { service, error, loading };
};
