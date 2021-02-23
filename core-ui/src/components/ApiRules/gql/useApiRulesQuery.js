import { useGet } from 'react-shared';
import { API_RULES_URL } from '../constants';
import { formatMessage } from 'components/Lambdas/helpers/misc';

export const useApiRulesQuery = ({ namespace, serviceName = undefined }) => {
  const { data, error, loading, silentRefetch } = useGet(
    formatMessage(API_RULES_URL, {
      namespace: namespace,
    }),
    { pollingInterval: 3000 },
  );
  const apiRules = data?.items.filter(
    rule => rule.spec.service.name === serviceName,
  );

  return {
    apiRules,
    error,
    loading,
    silentRefetch,
  };
};
