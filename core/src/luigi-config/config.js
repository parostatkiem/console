import { getApiUrl } from './auth/auth-params'

var clusterConfig = window['clusterConfig'] || INJECTED_CLUSTER_CONFIG;
const k8sDomain = getApiUrl() || 'kyma.local';
const localDomain = 'console-dev.' + k8sDomain;
const isLocalDev = window.location.href.startsWith(
  `http://${localDomain}:4200`
);

export const config = {
  domain: k8sDomain,
  localDomain: 'console-dev.' + k8sDomain,
  serviceCatalogModuleUrl: isLocalDev ? 'http://console-dev.'+ k8sDomain + ':8000' : 'https://catalog.' + k8sDomain,
  addOnsModuleUrl: isLocalDev ? 'http://console-dev.'+ k8sDomain + ':8004' : 'https://addons.' + k8sDomain,
  logsModuleUrl: isLocalDev ? 'http://console-dev.'+ k8sDomain + ':8005' : 'https://logs.' + k8sDomain,
  coreModuleUrl: isLocalDev ? 'http://console-dev.'+ k8sDomain +':8889' : 'https://core-ui.' + k8sDomain,
  graphqlApiUrl: 'https://console-backend.' + k8sDomain + '/graphql',
  apiserverUrl: 'https://apiserver.' + k8sDomain,
  disabledNavigationNodes: '',
  namespaceAdminGroupName: 'runtimeNamespaceAdmin',
  runtimeAdminGroupName: 'runtimeAdmin',
  systemNamespaces:
    'compass-system istio-system knative-eventing knative-serving kube-public kube-system kyma-backup kyma-installer kyma-integration kyma-system natss kube-node-lease kubernetes-dashboard serverless-system',
};
