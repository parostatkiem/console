import React from 'react';
import LuigiClient from '@luigi-project/client';
import { render, fireEvent } from '@testing-library/react';
import NamespaceSettings from '../NamespaceSettings';

jest.mock('react-shared', () => ({
  useMicrofrontendContext: () => ({ showSystemNamespaces: true }),
}));

describe('NamespaceSettings', () => {
  it('Sends custom message on toggle', () => {
    const spy = jest.spyOn(LuigiClient, 'sendCustomMessage');
    const { getByLabelText } = render(<NamespaceSettings />);

    fireEvent.click(getByLabelText('toggle-system-namespaces'));

    expect(spy).toHaveBeenCalledWith({
      id: 'console.showSystemNamespaces',
      showSystemNamespaces: false,
    });

    spy.mockRestore();
  });
});
