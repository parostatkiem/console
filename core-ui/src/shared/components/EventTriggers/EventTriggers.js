import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';

import { GenericList } from 'react-shared';

// import { SchemaComponent } from './Schema/Schema';

import { EVENT_TRIGGERS_PANEL, ERRORS } from '../../constants';

import CreateEventTriggerModal from './CreateEventTriggerModal';

const textSearchProperties = ['eventType', 'version', 'source', 'description'];

export default function EventTriggers({
  eventTriggers = [],
  isLambda = false,
  servicePorts = [],
  serverDataError,
  serverDataLoading,
  onTriggersAdd,
  onTriggerDelete,
  notFoundMessage = EVENT_TRIGGERS_PANEL.LIST.ERRORS.RESOURCES_NOT_FOUND,
}) {
  const actions = [
    {
      name: 'Delete',
      handler: onTriggerDelete,
    },
  ];

  const headerRenderer = _ => ['Event Type', 'Name', 'Protocol'];
  const rowRenderer = subscription => [
    subscription.spec.filter.filters[0]?.eventType.value,
    subscription.metadata.name,
    subscription.spec.protocol || '-',
  ];

  const createEventTrigger = (
    <CreateEventTriggerModal
      isLambda={isLambda}
      servicePorts={servicePorts}
      onSubmit={onTriggersAdd}
    />
  );

  return (
    <div>
      <GenericList
        title={EVENT_TRIGGERS_PANEL.LIST.TITLE}
        showSearchField={true}
        textSearchProperties={textSearchProperties}
        showSearchSuggestion={false}
        extraHeaderContent={createEventTrigger}
        actions={actions}
        entries={eventTriggers}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        serverDataError={serverDataError}
        serverDataLoading={serverDataLoading}
        notFoundMessage={notFoundMessage}
        noSearchResultMessage={
          EVENT_TRIGGERS_PANEL.LIST.ERRORS.NOT_MATCHING_SEARCH_QUERY
        }
        serverErrorMessage={ERRORS.SERVER}
      />
    </div>
  );
}

EventTriggers.propTypes = {
  eventTriggers: PropTypes.array.isRequired,
  serverDataError: PropTypes.any,
  serverDataLoading: PropTypes.bool,
  onTriggerDelete: PropTypes.func.isRequired,
  onTriggersAdd: PropTypes.func.isRequired,
};
