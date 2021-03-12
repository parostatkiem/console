import React from 'react';
import { useMicrofrontendContext } from 'react-shared';

// import { createLambdaRef } from './helpers';

import LambdaEventSubscriptions from './EventSubscriptionsWrapper';

export default function LambdaSubscriptionsWrapper({ lambda }) {
  const { bebEnabled } = useMicrofrontendContext();

  return <LambdaEventSubscriptions lambda={lambda} />;
}
