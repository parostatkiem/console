import React, { useEffect } from 'react';

import ServiceBindings from './ServiceBindings';
import { useServiceBindingUsagesQuery } from 'components/Lambdas/gql/hooks/queries';
import { Spinner } from 'react-shared';

export default function ServiceBindingsWrapper({
  lambda,
  setBindingUsages = () => void 0,
}) {
  // const { bindingUsages = [], error, loading } = useServiceBindingUsagesQuery({
  //   lambda,
  // });

  // useEffect(() => {
  //   setBindingUsages(bindingUsages);
  // }, [setBindingUsages, bindingUsages]);
  if (!lambda) return <Spinner />;

  return (
    <ServiceBindings
      lambda={lambda}
      serviceBindingUsages={[]}
      // serverDataError={error || false}
      // serverDataLoading={loading || false}
    />
  );
}
