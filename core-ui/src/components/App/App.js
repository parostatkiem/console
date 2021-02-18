import React from 'react';
import { Route, Switch } from 'react-router-dom';

import {
  getComponentForList,
  getComponentForDetails,
} from 'shared/getComponents';

export default function App() {
  return (
    <Switch>
      <Route path="/preload" component={() => null} />
      <Route
        exact
        path="/namespaces/:namespaceId/:resourceType/:resourceName"
        component={RoutedResourceDetails}
      />
      <Route
        exact
        path="/namespaces/:namespaceId/:resourceType"
        component={RoutedResourcesList}
      />
      <Route
        exact
        path="/:resourceType/:resourceName"
        component={RoutedResourceDetails}
      />
      <Route exact path="/:resourceType" component={RoutedResourcesList} />
    </Switch>
  );
}

function RoutedResourcesList({ match }) {
  const queryParams = new URLSearchParams(window.location.search);
  const resourceUrl =
    queryParams.get('resourceApiPath') + window.location.pathname;

  const params = {
    hasDetailsView: queryParams.get('hasDetailsView') === 'true',
    resourceUrl,
    resourceType: match.params.resourceType,
    namespace: match.params.namespaceId,
  };

  const rendererName =
    params.resourceType[0].toUpperCase() +
    params.resourceType.substr(1) +
    'List';

  return getComponentForList(rendererName, params);
}

function RoutedResourceDetails({ match }) {
  const queryParams = new URLSearchParams(window.location.search);
  const resourceUrl =
    queryParams.get('resourceApiPath') + window.location.pathname;

  const params = {
    resourceUrl,
    resourceType: match.params.resourceType,
    resourceName: match.params.resourceName,
    namespace: match.params.namespaceId,
  };

  const rendererName =
    params.resourceType[0].toUpperCase() +
    params.resourceType.substr(1) +
    'Details';

  return getComponentForDetails(rendererName, params);
}
