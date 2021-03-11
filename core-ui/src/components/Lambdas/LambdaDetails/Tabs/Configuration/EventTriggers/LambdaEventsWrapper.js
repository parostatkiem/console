import React from 'react';
import { useMicrofrontendContext } from 'react-shared';

// import { createLambdaRef } from './helpers';

import LambdaEventTriggers from './EventTriggersWrapper';

export default function LambdaEventsWrapper({ lambda }) {
  const { bebEnabled } = useMicrofrontendContext();

  return <LambdaEventTriggers lambda={lambda} />;
}
