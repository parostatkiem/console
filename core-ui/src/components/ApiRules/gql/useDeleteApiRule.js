import LuigiClient from '@luigi-project/client';

import { useNotification } from 'react-shared';
import { useDelete, handleDelete } from 'react-shared';
import { formatMessage } from 'components/Lambdas/helpers/misc';
import { GQL_MUTATIONS, API_RULE_URL } from '../constants';

export function useDeleteApiRule() {
  const namespace = LuigiClient.getContext().namespaceId;

  const deleteAPIRule = useDelete();

  async function handleResourceDelete(name) {
    return await handleDelete(
      'apirules',
      null,
      name,
      () =>
        deleteAPIRule(
          formatMessage(API_RULE_URL, {
            namespace: namespace,
            name: name,
          }),
        ),
      () => {},
    );
  }

  return handleResourceDelete;
}
