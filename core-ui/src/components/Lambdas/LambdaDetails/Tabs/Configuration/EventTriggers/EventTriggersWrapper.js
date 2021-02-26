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
  const activationsUrl = `/apis/applicationconnector.kyma-project.io/v1alpha1/namespaces/${lambda.metadata.namespace}/eventactivations`;
  const {
    data: events = [],
    error: activationsError,
    loading: activationsLoading,
  } = useGetList()(activationsUrl, {
    pollingInterval: 3000,
  });
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
  if (!events || !eventTriggers) return <Spinner />;
  // console.log(events, eventTriggers);
  const { availableEvents, usedEvents } = serializeEvents({
    events,
    eventTriggers,
  });
  console.log(availableEvents, usedEvents);
  // return null;
  return (
    <EventTriggers
      isLambda={true}
      // onTriggerDelete={deleteEventTrigger}
      // onTriggersAdd={createManyEventTriggers}
      eventTriggers={usedEvents || []}
      availableEvents={availableEvents || []}
      serverDataError={activationsError || triggersError || false}
      serverDataLoading={activationsLoading || triggersLoading || false}
    />
  );
}
EventTriggersWrapper.propTypes = {
  lambda: PropTypes.object.isRequired,
};
