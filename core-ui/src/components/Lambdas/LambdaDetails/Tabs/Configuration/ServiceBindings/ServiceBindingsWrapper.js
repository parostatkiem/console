import React, { useEffect } from 'react';

import ServiceBindings from './ServiceBindings';
import { useServiceBindingUsagesQuery } from 'components/Lambdas/gql/hooks/queries';
import { Spinner, useGetList } from 'react-shared';

export default function ServiceBindingsWrapper({
  lambda,
  setBindingUsages = () => void 0,
}) {
  const isBindingUsageForThisFunction = bindingUsage =>
    bindingUsage.spec.usedBy.kind === 'serverless-function' && //TODO use constant for this
    bindingUsage.spec.usedBy.name === lambda.metadata.name;

  const { loading = true, error, data: serviceBindings } = useGetList()(
    `/apis/servicecatalog.k8s.io/v1beta1/namespaces/${lambda?.metadata.namespace}/servicebindings`,
    {
      pollingInterval: 3100,
    },
  );

  const { /*loading = true, error,*/ data: bindingUsages } = useGetList()(
    `/apis/servicecatalog.kyma-project.io/v1alpha1/namespaces/${lambda?.metadata.namespace}/servicebindingusages`,
    {
      pollingInterval: 2900,
    },
  );

  const { /*loading = true, error,*/ data: secrets } = useGetList()(
    `/api/v1/namespaces/${lambda?.metadata.namespace}/secrets`,
    {
      pollingInterval: 3300,
    },
  );

  if (!bindingUsages || !serviceBindings || !secrets) return <Spinner />; //TODO

  const getBindingCombinedData = binding => {
    const usage = bindingUsages.find(
      u => binding.metadata.name === u.spec.serviceBindingRef.name,
    );
    return {
      serviceBinding: binding,
      serviceBindingUsage: usage,
      secret: binding
        ? secrets.find(s => s.metadata.name === binding.spec.secretName)
        : undefined,
    };
  };

  const serviceBindingsCombined = serviceBindings
    // .filter(isBindingUsageForThisFunction)
    .map(getBindingCombinedData);

  return (
    <ServiceBindings
      lambda={lambda}
      serviceBindingsCombined={serviceBindingsCombined}
      // serverDataError={error || false}
      // serverDataLoading={loading || false}
    />
  );
}
