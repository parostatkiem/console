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
      pollingInterval: 3000,
    },
  );

  const { /*loading = true, error,*/ data: bindingUsages } = useGetList()(
    `/apis/servicecatalog.kyma-project.io/v1alpha1/namespaces/${lambda?.metadata.namespace}/servicebindingusages`,
    {
      pollingInterval: 3000,
    },
  );

  if (!bindingUsages || !serviceBindings) return <Spinner />;

  const getBindingAndUsagePair = usage => ({
    serviceBindingUsage: usage,
    serviceBinding: serviceBindings.find(
      b => b.metadata.name === usage.spec.serviceBindingRef.name,
    ),
  });

  const serviceBindingAndUsagePairs = bindingUsages
    .filter(isBindingUsageForThisFunction)
    .map(getBindingAndUsagePair);

  const serviceInstancesAlreadyUsed = serviceBindingAndUsagePairs.map(
    ({ serviceBinding }) => serviceBinding.spec.instanceRef.name,
  );

  return (
    <ServiceBindings
      lambda={lambda}
      serviceBindingUsages={bindingUsages || []}
      serviceBindings={serviceBindings || []}
      serviceInstancesAlreadyUsed={serviceInstancesAlreadyUsed}
      serviceBindingAndUsagePairs={serviceBindingAndUsagePairs}
      // serverDataError={error || false}
      // serverDataLoading={loading || false}
    />
  );
}
