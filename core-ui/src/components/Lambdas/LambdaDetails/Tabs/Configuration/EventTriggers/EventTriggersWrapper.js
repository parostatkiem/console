import React from 'react';
import PropTypes from 'prop-types';
import { useGetList, Spinner } from 'react-shared';
import EventTriggers from 'shared/components/EventTriggers/EventTriggers';
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
  // const subscriberRef = createSubscriberRef(lambda);
  // const ownerRef = {
  //   apiVersion: SERVERLESS_API_VERSION,
  //   kind: SERVERLESS_RESOURCE_KIND,
  //   name: lambda.name,
  //   UID: lambda.UID,
  // };
  // const deleteEventTrigger = useDeleteEventTrigger(lambda);
  // const createManyEventTriggers = useCreateManyEventTriggers({
  //   ...lambda,
  //   subscriberRef,
  //   ownerRef,
  // });

  const eventsUrl = `/apis/eventing.knative.dev/v1alpha1/namespaces/${lambda.metadata.namespace}/triggers`;
  const filterByOwnerRef = ({ metadata }) =>
    metadata.ownerReferences?.find(
      ref => ref.kind === 'Function' && ref.name === lambda.metadata.name,
    );

  const {
    data: eventTriggers = [],
    error: triggersError,
    loading: triggersLoading,
  } = useGetList(filterByOwnerRef)(eventsUrl, {
    pollingInterval: 3000,
  });
  if (!eventTriggers) return <Spinner />;
  // console.log(events, eventTriggers);

  // return null;
  return (
    <EventTriggers
      isLambda={true}
      // onTriggerDelete={deleteEventTrigger}
      // onTriggersAdd={createManyEventTriggers}
      eventTriggers={eventTriggers || []}
      serverDataError={triggersError || false}
      serverDataLoading={triggersLoading || false}
    />
  );
}
EventTriggersWrapper.propTypes = {
  lambda: PropTypes.object.isRequired,
};
