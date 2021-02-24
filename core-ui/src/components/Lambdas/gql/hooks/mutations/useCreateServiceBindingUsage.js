import { useMutation } from '@apollo/react-hooks';
import { useNotification, usePost } from 'react-shared';

import {
  CREATE_SERVICE_BINDING,
  CREATE_SERVICE_BINDING_USAGE,
} from 'components/Lambdas/gql/mutations';
import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

import {
  formatMessage,
  randomNameGenerator,
} from 'components/Lambdas/helpers/misc';
import { GQL_MUTATIONS } from 'components/Lambdas/constants';
import { CONFIG } from 'components/Lambdas/config';

export const useCreateServiceBindingUsage = ({ lambda }) => {
  const postRequest = usePost();
  const notificationManager = useNotification();
  const [createServiceBindingMutation] = useMutation(CREATE_SERVICE_BINDING);
  const [createServiceBindingUsageMutation] = useMutation(
    CREATE_SERVICE_BINDING_USAGE,
  );

  function handleError(serviceInstanceName, error) {
    console.error(error);
    const errorToDisplay = extractGraphQlErrors(error);

    const message = formatMessage(
      GQL_MUTATIONS.CREATE_BINDING_USAGE.ERROR_MESSAGE,
      { serviceInstanceName },
    );

    notificationManager.notifyError({
      content: message,
      autoClose: false,
    });
  }

  function prepareServiceBindingUsageParameters({
    serviceBindingName,
    serviceBindingUsageParameters = undefined,
  }) {
    return {
      serviceBindingRef: {
        name: serviceBindingName,
      },
      usedBy: {
        name: lambda.name,
        kind: CONFIG.functionUsageKind,
      },
      parameters: serviceBindingUsageParameters,
    };
  }

  //   let createdResource = null;
  //   try {
  //     createdResource = await createServiceBindingUsage(
  //       formatDeployment(deployment),
  //     );
  //   } catch (e) {
  //     console.log(e);
  //     onError('Cannot create deployment', e.message);
  //     return;
  //   }
  //   // const createdResourceUID = createdResource?.metadata?.uid;

  //   // try {
  //   //   if (deployment.createService && createdResourceUID) {
  //   //     await createResource(formatService(deployment, createdResourceUID));
  //   //   }
  //   //   onCompleted(deployment.name, 'Deployment created');
  //   //   LuigiClient.linkManager()
  //   //     .fromContext('namespaces')
  //   //     .navigate('/deployments');
  //   // } catch (e) {
  //   //   onError('Deployment created, could not create service', e.message, true);
  //   // }
  // };

  async function createServiceBinding(name, namespace, instanceRefName) {
    return await postRequest(
      `/apis/servicecatalog.k8s.io/v1beta1/namespaces/${namespace}/servicebindings/${name}`,
      {
        apiVersion: 'servicecatalog.k8s.io/v1beta1',
        kind: 'ServiceBinding',
        metadata: {
          name,
          namespace,
          // labels: deployment.labels,
        },
        spec: {
          instanceRef: {
            name: instanceRefName,
          },
        },
      },
    );
  }

  async function createServiceBindingUsage(
    name,
    namespace,
    serviceBindingName,
    lambdaName,
    parameters,
  ) {
    return await postRequest(
      `/apis/servicecatalog.kyma-project.io/v1alpha1/namespaces/${namespace}/servicebindingusages/${name}`,
      {
        apiVersion: 'servicecatalog.kyma-project.io/v1alpha1',
        kind: 'ServiceBindingUsage',
        metadata: {
          name,
          namespace,
          // labels: deployment.labels,
        },
        spec: {
          serviceBindingRef: {
            name: serviceBindingName,
          },
          usedBy: {
            name: lambdaName,
            kind: CONFIG.functionUsageKind,
          },
          parameters,
        },
      },
    );
  }

  async function createServiceBindingUsageSet({
    namespace,
    serviceInstanceName,
    lambdaName,
    serviceBindingUsageParameters,
    existingCredentials = undefined,
  }) {
    try {
      let serviceBindingName = existingCredentials || randomNameGenerator();

      if (!existingCredentials)
        await createServiceBinding(
          serviceBindingName,
          namespace,
          serviceInstanceName,
        );

      await createServiceBindingUsage(
        randomNameGenerator(),
        namespace,
        serviceBindingName,
        lambdaName,
        serviceBindingUsageParameters,
      );
    } catch (err) {
      handleError(serviceInstanceName, err);
      return;
    }

    const message = formatMessage(
      GQL_MUTATIONS.CREATE_BINDING_USAGE.SUCCESS_MESSAGE,
      {
        serviceInstanceName,
      },
    );

    notificationManager.notifySuccess({
      content: message,
    });
  }

  return createServiceBindingUsageSet;
};
