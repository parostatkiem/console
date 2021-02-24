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
    const errorToDisplay = extractGraphQlErrors(error);

    const message = formatMessage(
      GQL_MUTATIONS.CREATE_BINDING_USAGE.ERROR_MESSAGE,
      {
        serviceInstanceName,
        error: errorToDisplay,
      },
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
    createCredentials = true,
    existingCredentials = undefined,
  }) {
    let serviceBindingName = existingCredentials || randomNameGenerator();

    if (!existingCredentials)
      await createServiceBinding(
        serviceBindingName,
        namespace,
        serviceInstanceName,
      );

    const createdBindingUsage = await createServiceBindingUsage(
      randomNameGenerator(),
      namespace,
      serviceBindingName,
      lambdaName,
      serviceBindingUsageParameters,
    );

    // const createdResourceUID = createdResource?.metadata?.uid;

    // try {
    //   let response = null;
    //   if (createCredentials) {
    //     response = await createServiceBindingMutation({
    //       variables: {
    //         serviceInstanceName,
    //         namespace: lambda.namespace,
    //       },
    //     });

    //     if (response.error) {
    //       handleError(serviceInstanceName, response.error);
    //       return;
    //     }
    //   }

    //   if (response && response.data) {
    //     serviceBindingName = response.data.createServiceBinding.name;
    //   }

    //   const serviceBindingUsageInput = prepareServiceBindingUsageParameters({
    //     serviceBindingName,
    //     serviceBindingUsageParameters,
    //   });

    //   response = await createServiceBindingUsageMutation({
    //     variables: {
    //       createServiceBindingUsageInput: serviceBindingUsageInput,
    //       namespace: lambda.namespace,
    //     },
    //   });

    //   if (response.error) {
    //     handleError(serviceInstanceName, response.error);
    //     return;
    //   }

    //   const message = formatMessage(
    //     GQL_MUTATIONS.CREATE_BINDING_USAGE.SUCCESS_MESSAGE,
    //     {
    //       serviceInstanceName,
    //     },
    //   );

    //   notificationManager.notifySuccess({
    //     content: message,
    //   });
    // } catch (err) {
    //   handleError(serviceInstanceName, err);
    // }
  }

  return createServiceBindingUsageSet;
};
