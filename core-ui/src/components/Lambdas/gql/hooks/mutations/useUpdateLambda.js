import { useMutation } from '@apollo/react-hooks';
import { useNotification, useUpdate } from 'react-shared';

import { createPatch } from 'rfc6902';

import { UPDATE_LAMBDA } from 'components/Lambdas/gql/mutations';
import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

import { formatMessage, omitTypenames } from 'components/Lambdas/helpers/misc';
import { GQL_MUTATIONS } from 'components/Lambdas/constants';

export const UPDATE_TYPE = {
  GENERAL_CONFIGURATION: 'GENERAL_CONFIGURATION',
  CODE_AND_DEPENDENCIES: 'CODE_AND_DEPENDENCIES',
  REPOSITORY_CONFIG: 'REPOSITORY_CONFIG',
  RESOURCES_AND_REPLICAS: 'RESOURCES_AND_REPLICAS',
  VARIABLES: 'VARIABLES',
};

export const useUpdateLambda = ({
  lambda,
  lambdaUrl,
  type = UPDATE_TYPE.GENERAL_CONFIGURATION,
}) => {
  console.log('lambdaUrl', lambdaUrl);
  const notificationManager = useNotification();
  const updateLambdaMutation = useUpdate(lambdaUrl);

  function handleError(error) {
    const errorToDisplay = extractGraphQlErrors(error);

    const message = formatMessage(
      GQL_MUTATIONS.UPDATE_LAMBDA[type].ERROR_MESSAGE,
      {
        lambdaName: lambda.name,
        error: errorToDisplay,
      },
    );

    notificationManager.notifyError({
      content: message,
      autoClose: false,
    });
  }

  async function updateLambda(updatedData, userCallback = () => {}) {
    try {
      const newLambda = {
        ...lambda,
        ...updatedData,
      };
      console.log(
        'updatedData',
        updatedData,
        'lambda',
        lambda,
        'newLambda',
        newLambda,
      );
      const diff = createPatch(lambda, newLambda);
      console.log('diff', diff);

      const response = await updateLambdaMutation(lambdaUrl, diff);

      if (response.error) {
        handleError(response.error);
        return;
      }

      const message = formatMessage(
        GQL_MUTATIONS.UPDATE_LAMBDA[type].SUCCESS_MESSAGE,
        {
          lambdaName: lambda.name,
        },
      );

      notificationManager.notifySuccess({
        content: message,
      });
      userCallback({ ok: true });
    } catch (err) {
      handleError(err);
      userCallback({ ok: false });
    }
  }

  return updateLambda;
};

export function prepareUpdateLambdaInput(lambda = {}) {
  const preparedLambda = {
    labels: lambda.labels || {},
    source: lambda.source || '',
    sourceType: lambda.sourceType || '',
    dependencies: lambda.dependencies || '',
    resources: lambda.resources || {},
    buildResources: lambda.buildResources || {},
    replicas: lambda.replicas || {},
    env: lambda.env || [],
    runtime: lambda.runtime || '',
    reference: lambda.reference || null,
    baseDir: lambda.baseDir || null,
  };

  return omitTypenames(preparedLambda);
}
