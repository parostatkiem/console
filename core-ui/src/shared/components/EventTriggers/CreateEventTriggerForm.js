import React, { useState, useEffect, useRef } from 'react';

import Checkbox from 'components/Lambdas/Checkbox/Checkbox';
// import { ComboboxInput, Menu, FormInput } from 'fundamental-react';
import {
  FormItem,
  FormLabel,
  FormInput,
  FormGroup,
  FormFieldset,
  FormLegend,
  Icon,
} from 'fundamental-react';
import { SchemaComponent } from './Schema/Schema';
import { InputWithPrefix } from 'react-shared';
import './CreateEventTriggerForm.scss';

const EVENT_TYPE_PREFIX = 'sap.kyma.custom.';

export default function CreateEventTriggerForm({
  formElementRef,
  isLambda = false,
  setCustomValid = () => void 0,
  onSubmit,
  onChange,
}) {
  // useEffect(() => {
  //   // setCustomValid(false);
  // }, [setCustomValid]);

  // useEffect(() => {
  //   // setCustomValid(!!events.filter(e => e.isChecked).length);
  // }, [events, setCustomValid]);

  const [calculatedEventType, setCalculatedEventType] = useState(null);

  const eventAppInput = useRef(),
    eventTypeInput = useRef(),
    eventVersionInput = useRef();

  const inputFields = [eventAppInput, eventTypeInput, eventVersionInput];

  const eventTypeFinalInput = useRef();

  async function handleSubmit() {
    // await onSubmit(events.filter(e => e.isChecked));
  }

  async function calculateEventType() {
    if (!inputFields.every(i => i.current?.value)) return; //cannot calculate value

    const newValue = inputFields.map(f => f.current.value).join('.');
    console.log(eventTypeFinalInput);
    eventTypeFinalInput.current.value = newValue;
  }

  async function handleEventTypeManualChange(e) {
    inputFields.forEach(i => {
      if (i.current) i.current.value = '';
    });
  }

  return (
    <form
      ref={formElementRef}
      onSubmit={handleSubmit}
      onChange={onChange}
      className="create-event-trigger-form"
    >
      <FormFieldset>
        <h2 className="fd-has-type-4">
          <Icon size="m" className="icon" glyph="process" />
          Calculate
          <span className="fd-has-font-style-italic fd-has-margin">
            {' '}
            eventType{' '}
          </span>
          field value
        </h2>

        <FormItem>
          <FormLabel
            htmlFor="event_app"
            required
            className="fd-has-display-block"
          >
            Application name
          </FormLabel>
          <FormInput
            ref={eventAppInput}
            onChange={calculateEventType}
            placeholder="Name of the application which is the source of the event"
            id="event_app"
          />
        </FormItem>
        <FormItem>
          <FormLabel
            htmlFor="event_type"
            required
            className="fd-has-display-block"
          >
            Event type
          </FormLabel>
          <FormInput
            onChange={calculateEventType}
            ref={eventTypeInput}
            placeholder="Type of the event"
            id="event_type"
          />
        </FormItem>
        <FormItem>
          <FormLabel
            htmlFor="event_version"
            required
            className="fd-has-display-block"
          >
            Event version
          </FormLabel>
          <FormInput
            onChange={calculateEventType}
            ref={eventVersionInput}
            placeholder="Version of the event"
            id="event_version"
            defaultValue="v1"
          />
        </FormItem>
      </FormFieldset>
      <div className="create-event-trigger-form--divider"></div>
      <FormFieldset>
        <h2 className="fd-has-type-4">
          <Icon size="m" className="icon" glyph="edit" />
          Enter
          <span className="fd-has-font-style-italic fd-has-margin">
            {' '}
            eventType{' '}
          </span>
          field value manually
        </h2>
        <FormItem>
          <FormLabel
            htmlFor="final_value"
            required
            className="fd-has-display-block"
          >
            eventType field value
          </FormLabel>
          <InputWithPrefix
            prefix={EVENT_TYPE_PREFIX}
            ref={eventTypeFinalInput}
            onChange={handleEventTypeManualChange}
            required
            placeholder="The eventType value used to create the subscription"
            id="final_value"
          />
        </FormItem>
      </FormFieldset>
    </form>
  );
}
