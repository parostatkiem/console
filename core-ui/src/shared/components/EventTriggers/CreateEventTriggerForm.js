import React, { useState, useEffect } from 'react';
import { GenericList } from 'react-shared';

import Checkbox from 'components/Lambdas/Checkbox/Checkbox';
import { ComboboxInput, Menu, FormInput } from 'fundamental-react';

import { SchemaComponent } from './Schema/Schema';

import './CreateEventTriggerForm.scss';

const headerRenderer = isLambda => {
  const baseHeaders = [
    '',
    '',
    'Event',
    'Version',
    'Source / Application',
    'Description',
  ];
  if (isLambda) {
    return () => baseHeaders;
  } else {
    return () => [...baseHeaders, 'Target port', 'Target path'];
  }
};

const textSearchProperties = ['eventType', 'version', 'source', 'description'];

export default function CreateEventTriggerForm({
  availableEvents = [],
  formElementRef,
  servicePorts,
  isLambda = false,
  setCustomValid = () => void 0,
  onSubmit,
  onChange,
}) {
  const [events, setEvents] = useState(
    availableEvents.map(event => ({
      ...event,
      port: servicePorts[0],
      path: '/',
      isChecked: false,
    })),
  );

  useEffect(() => {
    setCustomValid(false);
  }, [setCustomValid]);

  useEffect(() => {
    setCustomValid(!!events.filter(e => e.isChecked).length);
  }, [events, setCustomValid]);

  const portInput = event => {
    if (servicePorts.length > 1) {
      return (
        <ComboboxInput
          buttonProps={{ typeAttr: 'button' }}
          inputProps={{
            value: event.port,
            onChange: () => {},
            readOnly: true,
          }}
          placeholder="Choose port"
          menu={
            <Menu.List>
              {servicePorts.map(p => (
                <Menu.Item key={p} onClick={() => onSetPort(event, p)}>
                  {p}
                </Menu.Item>
              ))}
            </Menu.List>
          }
        />
      );
    } else {
      return <FormInput readOnly defaultValue={servicePorts[0]} />;
    }
  };

  const createRowCells = (event, isLambda) => {
    const baseCells = [
      <Checkbox
        initialChecked={event.isChecked}
        name={event.uniqueID}
        onChange={_ => onSetCheckedEvents(event)}
      />,
      <span>{event.eventType || '*'}</span>,
      <span>{event.version || '*'}</span>,
      <span>{event.spec.sourceId || '*'}</span>,
      <span>{event.spec.displayName || '-'}</span>,
    ];
    return isLambda
      ? baseCells
      : [
          ...baseCells,
          portInput(event),
          <FormInput
            placeholder="/"
            onChange={e => onSetPath(event, e.target.value)}
            pattern="^\/.*"
          />,
        ];
  };

  function onSetCheckedEvents(event) {
    event.isChecked = !event.isChecked;
    setEvents([...events]);
  }

  function onSetPort(event, port) {
    const e = events.find(entry => entry.uniqueID === event.uniqueID);
    e.port = port;
    e.isChecked = true;
    setEvents([...events]);
  }

  function onSetPath(event, path) {
    const e = events.find(entry => entry.uniqueID === event.uniqueID);
    e.path = path;
    e.isChecked = true;
    setEvents([...events]);
  }

  function showCollapseControl(schema) {
    return !!(schema && schema.properties && !schema.anyOf);
  }

  const rowRenderer = event => ({
    cells: createRowCells(event, isLambda),
    collapseContent: (
      <>
        <td></td>
        <td></td>
        <td colSpan="6">
          <SchemaComponent schema={event.schema} />
        </td>
      </>
    ),
    showCollapseControl: showCollapseControl(event.schema),
  });

  async function handleSubmit() {
    await onSubmit(events.filter(e => e.isChecked));
  }

  return (
    <form
      ref={formElementRef}
      onSubmit={handleSubmit}
      onChange={onChange}
      className="create-event-trigger-form"
    >
      <GenericList
        showSearchField={true}
        textSearchProperties={textSearchProperties}
        entries={events}
        headerRenderer={headerRenderer(isLambda)}
        rowRenderer={rowRenderer}
        hasExternalMargin={false}
        showSearchControl={false}
        showSearchSuggestion={false}
      />
    </form>
  );
}
