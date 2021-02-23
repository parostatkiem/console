import React from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/react-hooks';
import LuigiClient from '@luigi-project/client';

import { useGet } from 'react-shared';
import { Spinner, useNotification } from 'react-shared';
import { UPDATE_API_RULE } from '../../../gql/mutations';
import { GET_API_RULE } from '../../../gql/queries';
import ApiRuleForm from '../ApiRuleForm/ApiRuleForm';
import EntryNotFound from 'components/EntryNotFound/EntryNotFound';

EditApiRule.propTypes = {
  apiName: PropTypes.string.isRequired,
};

export default function EditApiRule({ apiName }) {
  const { redirectPath, redirectCtx = 'namespaces', openedInModal } =
    LuigiClient.getNodeParams() || {};
  const [updateApiRuleMutation] = useMutation(UPDATE_API_RULE, {
    onError: handleError,
    onCompleted: handleSuccess,
  });
  const notificationManager = useNotification();

  const {
    data,
    error,
    loading,
  } = useGet(
    `/apis/gateway.kyma-project.io/v1alpha1/namespaces/${
      LuigiClient.getEventData().environmentId
    }/apirules/${apiName}`,
    { pollingInterval: 3000000 },
  );

  console.log('Edit apiRules', data);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <h1>Couldn't fetch API rule data</h1>;
  }

  if (!data || !data.spec) {
    return <EntryNotFound entryType="API Rule" entryId={apiName} />;
  }

  data.spec.rules.forEach(rule => {
    delete rule.__typename;
    rule.accessStrategies.forEach(as => {
      delete as.__typename;
    });
  });

  function handleError(error) {
    if (openedInModal) {
      LuigiClient.uxManager().closeCurrentModal();
      // close current modal instead of doing the redirect
      return;
    }
    if (redirectPath) {
      LuigiClient.linkManager()
        .fromContext(redirectCtx)
        .navigate(decodeURIComponent(redirectPath));
      return;
    }

    notificationManager.notifyError({
      content: `Could not update API Rule: ${error.message}`,
    });
  }

  function handleSuccess(data) {
    if (openedInModal) {
      LuigiClient.uxManager().closeCurrentModal();
      // close current modal instead of doing the redirect
      return;
    }
    if (redirectPath) {
      LuigiClient.linkManager()
        .fromContext(redirectCtx)
        .navigate(decodeURIComponent(redirectPath));
      return;
    }

    const editedApiRuleData = data.updateAPIRule;
    if (editedApiRuleData) {
      notificationManager.notifySuccess({
        content: `API Rule ${editedApiRuleData.name} updated successfully`,
      });

      LuigiClient.linkManager()
        .fromClosestContext()
        .navigate(`/details/${apiName}`);
    }
  }

  const breadcrumbItems = [
    { name: 'API Rules', path: '/' },
    { name: apiName, path: `/details/${apiName}` },
    { name: '' },
  ];

  return (
    <ApiRuleForm
      apiRule={data}
      mutation={updateApiRuleMutation}
      saveButtonText="Save"
      headerTitle={`Edit ${apiName}`}
      breadcrumbItems={breadcrumbItems}
    />
  );
}
