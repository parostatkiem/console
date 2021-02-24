import React from 'react';

import CodeAndDependencies from './CodeAndDependencies/CodeAndDependencies';
import RepositoryConfig from './RepositoryConfig/RepositoryConfig';
import LambdaVariables from './LambdaVariables/LambdaVariables';

import { isGitSourceType } from 'components/Lambdas/helpers/lambdas';
import { serializeVariables } from 'components/Lambdas/helpers/lambdaVariables';

export default function CodeTab({ lambda, lambdaUrl, bindingUsages }) {
  const {
    customVariables,
    customValueFromVariables,
    injectedVariables,
  } = serializeVariables({
    lambdaVariables: lambda?.spec?.env,
    bindingUsages,
  });

  return (
    <>
      {isGitSourceType(lambda?.spec?.type) ? (
        <RepositoryConfig lambda={lambda} lambdaUrl={lambdaUrl} />
      ) : (
        <CodeAndDependencies lambda={lambda} lambdaUrl={lambdaUrl} />
      )}
      <LambdaVariables
        lambda={lambda}
        lambdaUrl={lambdaUrl}
        customVariables={customVariables}
        customValueFromVariables={customValueFromVariables}
        injectedVariables={injectedVariables}
      />
    </>
  );
}
