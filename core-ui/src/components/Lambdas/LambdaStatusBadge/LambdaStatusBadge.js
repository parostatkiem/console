import React from 'react';

import { StatusBadge } from 'react-shared';

import {
  LAMBDA_PHASES,
  LAMBDA_ERROR_PHASES,
} from 'components/Lambdas/constants';

import { statusType } from 'components/Lambdas/helpers/lambdas';
import { formatMessage } from 'components/Lambdas/helpers/misc';

export function LambdaStatusBadge({ status }) {
  const latestStatus = status.conditions[0]; // TODO Translate status like in console backend components/console-backend-service/internal/domain/serverless/function_converter.go
  const translatedStatus =
    latestStatus.status === 'True' && latestStatus.type === 'Running'
      ? { phase: 'RUNNING', reason: null, message: null }
      : { phase: 'FAILED', reason: null, message: null };

  const statusPhase = translatedStatus.phase;

  const texts = LAMBDA_PHASES[statusPhase];
  let badgeType = statusType(statusPhase);
  if (badgeType === 'info') {
    badgeType = undefined;
  }

  let tooltipText;

  if (LAMBDA_ERROR_PHASES.includes(statusPhase)) {
    const formattedError = formatMessage(LAMBDA_PHASES.ERROR_SUFFIX, {
      error: translatedStatus.message,
    });
    tooltipText = `${texts.MESSAGE} ${formattedError}`;
  }

  return (
    <StatusBadge tooltipContent={tooltipText} type={badgeType}>
      {texts.TITLE}
    </StatusBadge>
  );
}
