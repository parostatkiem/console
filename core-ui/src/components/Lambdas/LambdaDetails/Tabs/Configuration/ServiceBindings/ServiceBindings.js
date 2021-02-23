import React from 'react';
import LuigiClient from '@luigi-project/client';

import { GenericList } from 'react-shared';
import { Link } from 'fundamental-react';

import { useDeleteServiceBindingUsage } from 'components/Lambdas/gql/hooks/mutations';

import CreateServiceBindingModal from './CreateServiceBindingModal';

import { retrieveVariablesFromBindingUsage } from 'components/Lambdas/helpers/lambdaVariables';
import { SERVICE_BINDINGS_PANEL, ERRORS } from 'components/Lambdas/constants';

import './ServiceBindings.scss';

const headerRenderer = () => ['Instance', 'Environment Variable Names'];
const textSearchProperties = [
  'serviceBinding.serviceInstanceName',
  'serviceBinding.secret.data',
  'parameters.envPrefix.name',
  'envs',
];

export default function ServiceBindings({
  lambda = {},
  serviceBindingAndUsagePairs,
  serviceInstancesAlreadyUsed,
  serverDataError,
  serverDataLoading,
}) {
  const deleteServiceBindingUsage = useDeleteServiceBindingUsage({ lambda });

  const renderEnvs = bindingUsage => {
    return null; //TODO
    return (
      <>
        {bindingUsage.envs.map(env => (
          <div key={env.key}>{env.key}</div>
        ))}
      </>
    );
  };

  const actions = [
    {
      name: 'Delete',
      handler: bindingUsage => {
        deleteServiceBindingUsage(bindingUsage);
      },
    },
  ];
  const rowRenderer = ({ serviceBindingUsage, serviceBinding }) => [
    <Link
      className="link"
      data-test-id="service-instance-name"
      onClick={() =>
        LuigiClient.linkManager()
          .fromContext('namespaces')
          .navigate(
            `cmf-instances/details/${serviceBinding.spec.instanceRef.name}`, //TODO
          )
      }
    >
      {serviceBinding.spec.instanceRef.name}
    </Link>,
    renderEnvs(serviceBindingUsage),
  ];

  const createServiceBindingModal = (
    <CreateServiceBindingModal
      lambda={lambda}
      serviceInstancesAlreadyUsed={serviceInstancesAlreadyUsed}
    />
  );

  // const performedBindingUsages = serviceBindingUsages.map(usage => ({
  //   ...usage,
  //   envs: retrieveVariablesFromBindingUsage(usage),
  // }));

  return (
    <GenericList
      title={SERVICE_BINDINGS_PANEL.LIST.TITLE}
      textSearchProperties={textSearchProperties}
      showSearchField={true}
      showSearchSuggestion={false}
      extraHeaderContent={createServiceBindingModal}
      actions={actions}
      entries={serviceBindingAndUsagePairs}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      serverDataError={serverDataError}
      serverDataLoading={serverDataLoading}
      notFoundMessage={SERVICE_BINDINGS_PANEL.LIST.ERRORS.RESOURCES_NOT_FOUND}
      noSearchResultMessage={
        SERVICE_BINDINGS_PANEL.LIST.ERRORS.NOT_MATCHING_SEARCH_QUERY
      }
      serverErrorMessage={ERRORS.SERVER}
    />
  );
}
