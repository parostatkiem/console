import React, { useState, useEffect } from 'react';

import Checkbox from 'components/Lambdas/Checkbox/Checkbox';
import { ComboboxInput, Menu, FormInput } from 'fundamental-react';

import { SchemaComponent } from './Schema/Schema';

import './CreateEventTriggerForm.scss';

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

  async function handleSubmit() {
    // await onSubmit(events.filter(e => e.isChecked));
  }

  return (
    <form
      ref={formElementRef}
      onSubmit={handleSubmit}
      onChange={onChange}
      className="create-event-trigger-form"
    >
      <input type="text" />
    </form>
  );
}
