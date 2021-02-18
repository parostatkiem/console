import React from 'react';
import LuigiClient from '@luigi-project/client';

import LambdaDetails from './LambdaDetails';

import './LambdaDetails.scss';

export default function LambdaDetailsWrapper({ lambda, lambdaUrl }) {
  let content = null;

  if (!lambda) {
    content = <>Entry not found</>;
  } else {
    const backendModules = LuigiClient.getEventData().backendModules;
    content = (
      <LambdaDetails
        lambda={lambda}
        lambdaUrl={lambdaUrl}
        backendModules={backendModules}
      />
    );
  }

  return <div className="lambda-details">{content}</div>;
}
