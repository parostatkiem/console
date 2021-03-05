import React from 'react';

import { StatusBadge } from 'react-shared';
import { getBadgeTypeForStatus } from 'helpers/getBadgeTypeForStatus';

export const ServiceInstanceStatus = ({ instance }) => {
  const type = instance.status.conditions?.length
    ? instance.status.conditions[0].type
    : 'UNKNOWN';

  return (
    <StatusBadge
      tooltipContent={instance.status.conditions[0]?.message}
      type={getBadgeTypeForStatus(type.toUpperCase())}
    >
      {type}
    </StatusBadge>
  );
};
