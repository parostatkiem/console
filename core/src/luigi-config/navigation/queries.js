import { config } from './../config';
import { getInitParams } from './../init-params';

function createHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-Api-Url': getInitParams().kubernetesApiUrl,
  };
}

function mapMicrofrontends(microFrontendList, config) {
  return microFrontendList.items.map(({ metadata, spec }) => ({
    name: metadata.name,
    category: spec.category,
    viewBaseUrl: spec.viewBaseUrl || `https://${metadata.name}.${config.domain}`,
    navigationNodes: spec.navigationNodes
  }));
}

export function fetchConsoleInitData(token) {
  const backendModules = {
    path: '/apis/ui.kyma-project.io/v1alpha1/backendmodules',
    selector: data => ({ backendModules: data.items.map(bM => bM.metadata) })
  };

  const clusterMicroFrontends = {
    path: '/apis/ui.kyma-project.io/v1alpha1/clustermicrofrontends',
    selector: data => ({
      clusterMicroFrontends: data.items.map(cMF => ({
        ...cMF.spec,
        ...cMF.metadata
      }))
    })
  };

  const ssrr = {
    typeMeta: {
      kind: 'SelfSubjectRulesReview',
      aPIVersion: 'authorization.k8s.io/v1'
    },
    spec: { namespace: '*' }
  };
  // we are doing SSRR query separately as it's requires a request body
  // vide components/console-backend-service/internal/domain/k8s/selfsubjectrules_resolver.go
  const ssrrQuery = fetch(`${config.pamelaApiUrl}${'/apis/authorization.k8s.io/v1/selfsubjectrulesreviews'}`, {
    method: 'POST',
    body: JSON.stringify(ssrr),
    headers: createHeaders(token), 
  }).then(res => res.json()).then(res => ({selfSubjectRules: res.status.resourceRules}));

  const promises = [
    backendModules,
    clusterMicroFrontends,
  ].map(({ path, selector }) => fetch(`${config.pamelaApiUrl}${path}`, {
    headers: createHeaders(token),
  }).then(res => res.json()).then(selector));

  return Promise.all([...promises, ssrrQuery]).then(res =>
    Object.assign(...res)
  );
}

export function fetchMicrofrontends(namespaceName, token) {
  return fetch(
    `${config.pamelaApiUrl}/apis/ui.kyma-project.io/v1alpha1/namespaces/${namespaceName}/microfrontends`,
    {
      headers: createHeaders(token)
    }
  )
    .then(res => res.json())
    .then(res => mapMicrofrontends(res, config));
}

export function fetchNamespaces(token) {
  return fetch(`${config.pamelaApiUrl}/api/v1/namespaces/`, {
    headers: createHeaders(token)
  })
    .then(res => res.json())
    .then(list => list.items.map(ns => ns.metadata));
}
