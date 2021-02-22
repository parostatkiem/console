import React from 'react';

import ResourcesManagement from './ResourceManagement/ResourceManagement';

export default function ResourceManagementTab({ lambda, lambdaUrl }) {
  return <ResourcesManagement lambda={lambda} lambdaUrl={lambdaUrl} />;
}
