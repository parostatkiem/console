import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';

import { useGet, useUpdate } from 'react-shared';
import { Spinner } from 'react-shared';
import ApiRuleForm from '../ApiRuleForm/ApiRuleForm';
import EntryNotFound from 'components/EntryNotFound/EntryNotFound';

EditApiRule.propTypes = {
  apiName: PropTypes.string.isRequired,
};

export default function EditApiRule({ apiName }) {
  const updateApiRuleMutation = useUpdate();

  const {
    data,
    error,
    loading = true,
  } = useGet(
    `/apis/gateway.kyma-project.io/v1alpha1/namespaces/${
      LuigiClient.getEventData().environmentId
    }/apirules/${apiName}`,
    { pollingInterval: 3000000 },
  );

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
