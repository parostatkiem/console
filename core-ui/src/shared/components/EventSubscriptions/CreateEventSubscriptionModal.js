import React from 'react';

import { Button } from 'fundamental-react';
import { Tooltip, ModalWithForm } from 'react-shared';

import CreateEventSubscriptionForm from './CreateEventSubscriptionForm';

import { EVENT_TRIGGERS_PANEL } from '../../constants';

export default function CreateEventSubscriptionModal({
  isLambda = false,
  servicePorts,
  onSubmit,
}) {
  const isServiceWithNoPorts = !isLambda && !servicePorts.length;

  const button = (
    <Button glyph="add" option="light" disabled={Boolean(isServiceWithNoPorts)}>
      {EVENT_TRIGGERS_PANEL.ADD_MODAL.OPEN_BUTTON.TEXT}
    </Button>
  );

  let modalOpeningComponent = button;

  if (isServiceWithNoPorts) {
    modalOpeningComponent = (
      <Tooltip
        content={
          EVENT_TRIGGERS_PANEL.ADD_MODAL.OPEN_BUTTON.NO_EXPOSED_PORTS_MESSAGE
        }
      >
        {button}
      </Tooltip>
    );
  }

  return (
    <ModalWithForm
      title={EVENT_TRIGGERS_PANEL.ADD_MODAL.TITLE}
      modalOpeningComponent={modalOpeningComponent}
      confirmText={EVENT_TRIGGERS_PANEL.ADD_MODAL.CONFIRM_BUTTON.TEXT}
      invalidPopupMessage={
        EVENT_TRIGGERS_PANEL.ADD_MODAL.CONFIRM_BUTTON.INVALID_POPUP_MESSAGE
      }
      id="add-event-trigger-modal"
      className="fd-modal--xl-size"
      renderForm={props => (
        <CreateEventSubscriptionForm
          {...props}
          isLambda={isLambda}
          servicePorts={servicePorts}
          onSubmit={onSubmit}
        />
      )}
    />
  );
}
