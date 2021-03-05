import React from 'react';
import LuigiClient from '@luigi-project/client';

import { Icon } from 'fundamental-react';
import { Modal, useMicrofrontendContext, useGetList } from 'react-shared';
import {
  LinkButton,
  Link,
  ServiceClassButton,
  ServicePlanButton,
  JSONCode,
  TextOverflowWrapper,
} from './styled';

import { DOCUMENTATION_PER_PLAN_LABEL } from 'helpers/constants';
import { ServiceInstanceStatus } from './../../../shared/ServiceInstanceStatus.js';

const goToServiceInstanceDetails = name => {
  LuigiClient.linkManager()
    .fromContext('namespaces')
    .navigate(`cmf-instances/details/${name}`);
};

const ServiceInstanceName = ({ instance }) => (
  <TextOverflowWrapper>
    <LinkButton data-e2e-id="instance-name">
      <Link
        onClick={() => goToServiceInstanceDetails(instance.metadata.name)}
        data-e2e-id={`instance-name-${instance.name}`}
        title={instance.metadata.name}
      >
        {instance.metadata.name}
      </Link>
    </LinkButton>
  </TextOverflowWrapper>
);

const ServiceClassName = ({ instance }) => {
  const className =
    instance.spec.serviceClassExternalName ||
    instance.spec.clusterServiceClassExternalName;

  const classRef =
    instance.spec.serviceClassRef?.name ||
    instance.spec.clusterServiceClassRef?.name;

  if (!className) return '-';

  return (
    <TextOverflowWrapper>
      <ServiceClassButton
        onClick={
          classRef
            ? () =>
                LuigiClient.linkManager()
                  .fromContext('namespaces')
                  .navigate(`cmf-service-catalog/details/${classRef}`)
            : null
        }
        title={className}
      >
        {className}
      </ServiceClassButton>
    </TextOverflowWrapper>
  );
};

const Plan = ({ instance }) => {
  const planDisplayName =
    instance.spec.servicePlanExternalName ||
    instance.spec.clusterServicePlanExternalName;

  const planRef =
    instance.spec.servicePlanRef?.name ||
    instance.spec.clusterServicePlanRef?.name;

  if (!planDisplayName) return '-';

  if (
    instance.spec.parameters &&
    typeof instance.spec.parameters === 'object' &&
    Object.keys(instance.spec.parameters).length
  ) {
    return (
      <TextOverflowWrapper>
        <Modal
          title="Instance's Parameters"
          modalOpeningComponent={
            <ServicePlanButton data-e2e-id="service-plan">
              {planDisplayName} <Icon glyph="detail-view" size="s" />
            </ServicePlanButton>
          }
          confirmText="Close"
        >
          <JSONCode data-e2e-id="service-plan-content">
            {JSON.stringify(instance.spec.parameters, null, 2)}
          </JSONCode>
        </Modal>
      </TextOverflowWrapper>
    );
  }
  return (
    <TextOverflowWrapper>
      <span data-e2e-id="service-plan">{planDisplayName}</span>
    </TextOverflowWrapper>
  );
};

const BindingUsagesCount = ({ instance }) => {
  const { namespaceId } = useMicrofrontendContext();

  const { data: bindingUsages } = useGetList()(
    `/apis/servicecatalog.kyma-project.io/v1alpha1/namespaces/${namespaceId}/servicebindingusages`,
    {
      pollingInterval: 2900,
    },
  );

  if (!bindingUsages)
    return (
      <div
        className="fd-loading-spinner fd-loading-spinner--small"
        aria-hidden="false"
        aria-label="Loading"
      ></div>
    );

  console.log(bindingUsages);
  // I think this is not the way we should go

  const capitalize = str =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const displayBindingsUsages = (bindings = []) => {
    if (!bindings) return null;

    switch (bindings.length) {
      case 0:
        return '-';
      case 1:
        return `${bindings[0].usedBy.name} (${capitalize(
          bindings[0].usedBy.kind,
        )})`;
      default:
        return `Multiple (${bindings.length})`;
    }
  };

  return (
    <TextOverflowWrapper>
      {displayBindingsUsages(instance.serviceBindingUsages)}
    </TextOverflowWrapper>
  );
};

export default function renderRow(
  instance,
  serviceCatalogAddonsBackendModuleExists,
) {
  return [
    <ServiceInstanceName instance={instance} />,
    <ServiceClassName instance={instance} />,
    <Plan instance={instance} />,
    ...(serviceCatalogAddonsBackendModuleExists
      ? [<BindingUsagesCount instance={instance} />]
      : []),
    <ServiceInstanceStatus instance={instance} />,
  ];
}
