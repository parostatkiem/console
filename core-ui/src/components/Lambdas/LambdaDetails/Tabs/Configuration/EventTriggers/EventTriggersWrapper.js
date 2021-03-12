import React from 'react';
import PropTypes from 'prop-types';
import { useGetList, Spinner, usePost, useNotification } from 'react-shared';
import EventSubscriptions from 'shared/components/EventSubscriptions/EventSubscriptions';
import {
  useEventActivationsQuery,
  useEventTriggersQuery,
} from 'components/Lambdas/gql/hooks/queries';
import {
  SERVERLESS_API_VERSION,
  SERVERLESS_RESOURCE_KIND,
} from '../../../../constants';
import {
  useDeleteEventTrigger,
  useCreateManyEventTriggers,
} from 'components/Lambdas/gql/hooks/mutations';
import {
  serializeEvents,
  createSubscriberRef,
} from 'components/Lambdas/helpers/eventTriggers';

export default function EventTriggersWrapper({ lambda }) {
  const notificationManager = useNotification();
  const postRequest = usePost();

  const subscriptionsUrl = `/apis/eventing.kyma-project.io/v1alpha1/namespaces/${lambda.metadata.namespace}/subscriptions`;

  const ownerRef = {
    apiVersion: SERVERLESS_API_VERSION,
    kind: SERVERLESS_RESOURCE_KIND,
    name: lambda.metadata.name,
    uid: lambda.metadata.uid,
  };

  async function handleSubscriptionAdded(eventType) {
    try {
      const name = lambda.metadata.name + '.' + eventType; //TODO
      const sink = `http://${lambda.metadata.name}.${lambda.metadata.namespace}.svc.cluster.local`;

      await postRequest(`${subscriptionsUrl}/${name}`, {
        apiVersion: 'eventing.kyma-project.io/v1alpha1',
        kind: 'Subscription',
        metadata: {
          name,
          namespace: lambda.metadata.namespace,
          ownerReferences: [ownerRef],
        },
        spec: {
          protocol: '',
          protocolsettings: {},
          sink,
          filter: {
            filters: [
              {
                eventSource: { property: 'source', type: 'exact', value: '' },
                eventType: {
                  property: 'type',
                  type: 'exact',
                  value: eventType,
                },
              },
            ],
          },
        },
      });

      notificationManager.notifySuccess({
        content: 'Subscription created succesfully',
      });
    } catch (err) {
      console.error(err);
      notificationManager.notifyError({
        content: err.message,
        autoClose: false,
      });
    }
  }

  const filterByOwnerRef = ({ metadata }) =>
    metadata.ownerReferences?.find(
      ref =>
        ref.kind === SERVERLESS_RESOURCE_KIND &&
        ref.name === lambda.metadata.name,
    );

  const { data: subscriptions = [], error, loading } = useGetList(
    filterByOwnerRef,
  )(subscriptionsUrl, {
    pollingInterval: 3000,
  });

  if (!subscriptions) return <Spinner />;
  // console.log(events, eventTriggers);

  // return null;
  return (
    <EventSubscriptions
      isLambda={true}
      // onTriggerDelete={deleteEventTrigger}
      onSubscriptionAdd={handleSubscriptionAdded}
      subscriptions={subscriptions || []}
      serverDataError={error || false}
      serverDataLoading={loading || false}
    />
  );
}
EventTriggersWrapper.propTypes = {
  lambda: PropTypes.object.isRequired,
};
